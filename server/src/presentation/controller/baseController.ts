import { NextFunction, Request, Response } from 'express'
import IBaseService from '../../application/base/baseService.interface'
import { BusinessError } from '../../domain/share/businessError'
import { AuthData, PaginationParams } from '../../domain/share/type'

export default class BaseController<T, TDtoInsert, TDtoUpdate> {
  readonly #service: IBaseService<T, TDtoInsert, TDtoUpdate>
  constructor(service: IBaseService<T, TDtoInsert, TDtoUpdate>) {
    this.#service = service
  }

  get = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const entities = await this.#service.get()
      return res.json(entities)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id
      const entity = await this.#service.getById(id)
      if (!entity) throw new BusinessError(404)
      return res.json(entity)
    } catch (error) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authData: AuthData = res.locals.authData
      const entity: TDtoInsert = req.body
      const createdEntity = await this.#service.create(entity, undefined, authData)
      return res.status(201).json(createdEntity)
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authData: AuthData = res.locals.authData
      const id = req.params.id
      const entity: TDtoUpdate = req.body
      await this.#service.update(id, entity, undefined, authData)
      return res.sendStatus(204)
    } catch (error) {
      next(error)
    }
  }

  patch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authData: AuthData = res.locals.authData
      const id = req.params.id
      const entity: Partial<T> = req.body
      await this.#service.patch(id, entity, undefined, authData)
      return res.sendStatus(204)
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id
      await this.#service.delete(id)
      return res.sendStatus(204)
    } catch (error) {
      next(error)
    }
  }

  getPagination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params: PaginationParams = req.query
      const paginationResult = await this.#service.getPagination(
        params,
        params.pageSize,
        params.pageIndex,
        params.sort
      )
      return res.json(paginationResult)
    } catch (error) {
      next(error)
    }
  }
}
