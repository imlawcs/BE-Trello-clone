import listService from "./list.service";
import e, { Request, Response, NextFunction } from "express";
import { List } from "../../database/entities/list";

class ListController {
    public async findAllList(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const lists = await listService.findAllList();
            res.status(200).json(lists);
        } catch (error) {
            next(error);
        }
    }

    public async findByName(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const name = req.params.name;
            const list = await listService.findByName(name);
            res.status(200).json(list);
        } catch (error) {
            next(error);
        }
    }

    public async findByListId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const list = await listService.findByListId(id);
            res.status(200).json(list);
        } catch (error) {
            next(error);
        }
    }

    public async createList(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const list = req.body as List;
            const newList = await listService.createList(list);
            res.status(201).json(newList);
        } catch (error) {
            next(error);
        }
    }

    public async updateList(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const list = req.body as Partial<List>;
            await listService.updateList(id, list);
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }

    public async deleteList(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            await listService.deleteList(id);
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }

    public async getListCards(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const cards = await listService.getListCards(id);
            res.status(200).json(cards);
        } catch (error) {
            next(error);
        }
    }

    public async addCardToList(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const cardId = parseInt(req.params.cardId);
            await listService.addCardToList(id, cardId);
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }

    public async removeCardFromList(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const cardId = parseInt(req.params.cardId);
            await listService.removeCardFromList(id, cardId);
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }
}

export default new ListController();