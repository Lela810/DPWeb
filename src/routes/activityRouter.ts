// ...existing code...
import express from 'express';
import {
    Activity,
    Program,
    mails,
    PrismaClient,
    Departmant
} from '@prisma/client';
import { activityEntry } from '../types/prismaEntry';
import { error } from 'node:console';

export const activityRouter = express.Router();
const prisma = new PrismaClient();

async function renderEditActivity(
    res: express.Response,
    activityId: string,
    req: express.Request
) {
    const activity = await prisma.activity.findUniqueOrThrow({
        where: {
            id: activityId,
        },
    });

    // Programme zur Activity (alle)
    const detailprogramm = await prisma.program.findMany({
        where: {
            activityId: activity.id as string,
        },
    });

   const departments = Object.values(Departmant);

    res.render('activity_edit', {
        user: req.user,
        page: 'Aktivität',
        activity: activity,
        detailprogramm: detailprogramm,
        action: 'update',
        departments: departments,
    });
}

// Rendern des "Neue Aktivität"-Formulars
async function renderCreateActivityView(res: express.Response, req: express.Request) {
    // Leere/default Werte; Template sollte mit fehlenden Werten umgehen können
    const emptyActivity: Partial<Activity> = {
        title: '',
        date: new Date(),
        start_time: '',
        end_time: '',
        goal: '',
        location: '',
        responsible: '',
        material: [],
        needs_SiKo: false
    };
   const departments = Object.values(Departmant);

    res.render('activity_edit', {
        user: req.user,
        page: 'Neue Aktivität',
        activity: emptyActivity,
        detailprogramm: [],
        action: 'create',
        departments: departments,
        });
}

/**
 * Routes
 */

// GET /create -> View für neue Activity
activityRouter.get('/create', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        await renderCreateActivityView(res, req);
    } catch (err) {
        next(err);
    }
});

// GET /update?id=... -> View zum Bearbeiten (existierende Activity)
activityRouter.get('/update', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const activityId = req.query.id as string;
    if (!activityId) return next(new Error('Missing activity id'));
    try {
        await prisma.activity.findUniqueOrThrow({ where: { id: activityId } });
        await renderEditActivity(res, activityId, req);
    } catch (err) {
        next(err);
    }
});

// GET /:id -> Detailansicht (Activity + Programme + Mails)
activityRouter.get('/:id', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const activityId = req.params.id;
    try {
        const activity = await prisma.activity.findUniqueOrThrow({ where: { id: activityId } });
        const programs = await prisma.program.findMany({ where: { activityId: activity.id } });

        res.render('activityDetail', {
            user: req.user,
            page: 'Aktivität',
            activity,
            programs
        });
    } catch (err) {
        next(err);
    }
});

// GET / -> Liste aller Activities
activityRouter.get('/', async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const activities = await prisma.activity.findMany();
        res.render('activity', {
            user: req.user,
            page: 'Aktivitäten',
            activities,
        });
    } catch (err) {
        next(err);
    }
});

// POST /create -> Activity anlegen
activityRouter.post('/create', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const body = req.body as Record<string, any>;

        // Pflichtfelder prüfen (prisma gibt sonst kryptische Fehlermeldung)
        const required = ['title','date','start_time','end_time','goal','location','responsible','needs_SiKo'];
        const missing = required.filter(k => {
            const v = body[k];
            return v === undefined || v === null || v === '';
        });
        if (missing.length) return next(new Error('Missing fields: ' + missing.join(', ')));

        const data: any = {
            title: body.title,
            date: body.date ? new Date(body.date) : new Date(),
            start_time: body.start_time,
            end_time: body.end_time,
            goal: body.goal,
            location: body.location,
            responsible: body.responsible,
            departmant: body.departmant || null,
            material: Array.isArray(body.material)
                ? body.material
                : (body.material ? (body.material as string).split(',').map((s:string) => s.trim()).filter(Boolean) : []),
            needs_SiKo: body.needs_SiKo === 'on' || body.needs_SiKo === 'true' || body.needs_SiKo === '1' || body.needs_SiKo === true,
            bad_weather_info: body.bad_weather_info || null
        };

        const activity = await prisma.activity.create({
            data: data as any,
        });

        // Nach Erstellung zur Edit-View springen
        await renderEditActivity(res, activity.id, req);
    } catch (err) {
        next(err);
    }
});

// POST /update -> Activity updaten
activityRouter.post('/update', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const activityId = (req.query.id as string) || (req.body.id as string);
        if (!activityId) return next(new Error('Missing activity id for update'));

        const activityEntry = req.body as activityEntry;

        await prisma.activity.update({
            data: activityEntry as any,
            where: {
                id: activityId,
            },
        });

        await renderEditActivity(res, activityId, req);
    } catch (err) {
        next(err);
    }
});

// POST /delete -> Activity löschen (inkl. abhängiger Einträge)
activityRouter.post('/delete', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const activityId = (req.query.id as string) || (req.body.id as string);
        if (!activityId) return next(new Error('Missing activity id for delete'));

        // Abhängige Einträge löschen, damit keine Referenzen übrig bleiben
        await prisma.program.deleteMany({ where: { activityId } });
        await prisma.flyer.deleteMany({ where: { activityId } });
        await prisma.mails.deleteMany({ where: { activityId } });

        await prisma.activity.delete({ where: { id: activityId } });

        // Zur Liste weiterleiten
        res.redirect('/activity');
    } catch (err) {
        next(err);
    }
});