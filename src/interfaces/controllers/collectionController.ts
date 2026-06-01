import { Request, Response, NextFunction } from "express";
import { SupabaseCollectionRepository } from "@infrastructure/database/repositories/SupabaseCollectionRepository";
import {
  GetAllCollections, GetCollectionBySlug,
  CreateCollection, UpdateCollection,
} from "@application/use-cases/collection";

const repo      = new SupabaseCollectionRepository();
const getAll    = new GetAllCollections(repo);
const getBySlug = new GetCollectionBySlug(repo);
const create    = new CreateCollection(repo);
const update    = new UpdateCollection(repo);

export const collectionController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try { return res.json(await getAll.execute()); } catch (e) { next(e); }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try { return res.json(await getBySlug.execute(req.params.slug)); } catch (e) { next(e); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try { return res.status(201).json(await create.execute(req.body)); } catch (e) { next(e); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try { return res.json(await update.execute(req.params.slug, req.body)); } catch (e) { next(e); }
  },
};
