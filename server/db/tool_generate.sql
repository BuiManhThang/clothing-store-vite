use clothing_store;

set
  @entityName = 'OrderDiscount';

set
  @entityNameLower = 'orderDiscount';

set
  @tableName = 'order_discount';

set
  @codePrefix = 'O';

set
  @hasCode = 0;

select
  1 into @hasCode
FROM
  INFORMATION_SCHEMA.COLUMNS
WHERE
  TABLE_SCHEMA = 'clothing_store'
  AND TABLE_NAME = @tableName
  AND COLUMN_NAME = 'code';

-- Entity
SELECT
  CONCAT (
    '
import { BaseEntity } from "../share/baseEntity";

export type ',
    @entityName,
    'Entity = {',
    GROUP_CONCAT (
      COLUMN_NAME,
      IF (IS_NULLABLE, '?: ', ': '),
      CASE
        WHEN DATA_TYPE = 'varchar' THEN 'string'
        WHEN DATA_TYPE = 'char' THEN 'string'
        WHEN DATA_TYPE = 'decimal' THEN 'number'
        WHEN DATA_TYPE = 'tinyint' THEN 'boolean'
      END
    ),
    '} & BaseEntity
'
  ) AS Entity
FROM
  INFORMATION_SCHEMA.COLUMNS
WHERE
  TABLE_SCHEMA = 'clothing_store'
  AND TABLE_NAME = @tableName
  AND COLUMN_NAME NOT IN (
    'id',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy'
  );

-- interface
select
  CONCAT (
    'import IBaseRepo from "../base/baseRepo.interface";
import { ',
    @entityName,
    'Entity } from "./',
    @entityNameLower,
    'Entity";
export default interface I',
    @entityName,
    'Repo extends IBaseRepo< ',
    @entityName,
    'Entity > {}
'
  ) as `Repo Interface`,
  -- Repo
  CONCAT (
    '
import { ',
    @entityName,
    'Entity } from "../domain/',
    @entityNameLower,
    '/',
    @entityNameLower,
    'Entity";
import I',
    @entityName,
    'Repo from "../domain/',
    @entityNameLower,
    '/',
    @entityNameLower,
    'Repo.interface";
import MysqlBaseRepo from "./mysqlBaseRepo";

export default class MySql',
    @entityName,
    'Repo
  extends MysqlBaseRepo< ',
    @entityName,
    'Entity >
  implements I',
    @entityName,
    'Repo
{
  constructor() {
    super("',
    @tableName,
    '");
  }
}
'
  ) AS `Repo`,
  -- Dto
  CONCAT (
    'import { ',
    @entityName,
    'Entity } from "../../domain/',
    @entityNameLower,
    '/',
    @entityNameLower,
    'Entity";

export type ',
    @entityName,
    'DtoInsert = Omit< 
  ',
    @entityName,
    'Entity,
  "createdAt" | "createdBy" | "updatedAt" | "updatedBy" | "id"
 >;

export type ',
    @entityName,
    'DtoUpdate = Omit< 
  ',
    @entityName,
    'Entity,
  "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
 >;
'
  ) AS Dto,
  -- Service interface
  CONCAT (
    'import { ',
    @entityName,
    'Entity } from "../../domain/',
    @entityNameLower,
    '/',
    @entityNameLower,
    'Entity";
import { ',
    @entityName,
    'DtoInsert, ',
    @entityName,
    'DtoUpdate } from "./',
    @entityNameLower,
    'Dto";
import IBaseService from "../base/baseService.interface";

export default interface I',
    @entityName,
    'Service
  extends IBaseService< ',
    @entityName,
    'Entity, ',
    @entityName,
    'DtoInsert, ',
    @entityName,
    'DtoUpdate > {}
'
  ) AS `Service Interface`,
  -- service
  CONCAT (
    '
import BaseService from "../base/baseService";
import { ',
    @entityName,
    'Entity } from "../../domain/',
    @entityNameLower,
    '/',
    @entityNameLower,
    'Entity";
import I',
    @entityName,
    'Repo from "../../domain/',
    @entityNameLower,
    '/',
    @entityNameLower,
    'Repo.interface";
',IF(@hasCode, 'import { QueryOperator, ValidationCode } from "../../domain/share/enumeration";', ''),'
import { ValidationCondition } from "../../domain/share/type";
import { ',
    @entityName,
    'DtoInsert, ',
    @entityName,
    'DtoUpdate } from "./',
    @entityNameLower,
    'Dto";
import I',
    @entityName,
    'Service from "./',
    @entityNameLower,
    'Service.interface";

const validationConditions: ValidationCondition[] = [];

export default class ',
    @entityName,
    'Service
  extends BaseService< ',
    @entityName,
    'Entity, ',
    @entityName,
    'DtoInsert, ',
    @entityName,
    'DtoUpdate >
  implements I',
    @entityName,
    'Service
{
  ',
    IF (
      @hasCode,
      CONCAT ('readonly #repo: I', @entityName, 'Repo;'),
      ''
    ),
    '

  constructor(repo: I',
    @entityName,
    'Repo) {
    super(repo, validationConditions);
    ',
    IF (@hasCode, CONCAT ('this.#repo = repo;'), ''),
    '
  }

  ',
    IF (
      @hasCode,
      CONCAT (
        '_customValidateCreateAsync = async (entity: ',
        @entityName,
        'DtoInsert) => {
    const existedEntity = await this.#repo.getEntity({
      filterObject: { fieldName: "code", operator: QueryOperator.Equal, value: entity.code },
    });
    if (existedEntity) {
      return [
        {
          fieldName: "code",
          validationCode: ValidationCode.CodeExist,
        },
      ];
    }
    return [];
  }'
      ),
      ''
    ),
    '
}
'
  ) AS Service,
  -- Controller
  CONCAT (
    '
import { ',
    @entityName,
    'DtoInsert, ',
    @entityName,
    'DtoUpdate } from "../../application/',
    @entityNameLower,
    '/',
    @entityNameLower,
    'Dto";
import I',
    @entityName,
    'Service from "../../application/',
    @entityNameLower,
    '/',
    @entityNameLower,
    'Service.interface";
import { ',
    @entityName,
    'Entity } from "../../domain/',
    @entityNameLower,
    '/',
    @entityNameLower,
    'Entity";
import BaseController from "./baseController";
',IF(@hasCode, 'import { Request, Response, NextFunction } from "express";', ''),'

export default class ',
    @entityName,
    'Controller extends BaseController< 
  ',
    @entityName,
    'Entity,
  ',
    @entityName,
    'DtoInsert,
  ',
    @entityName,
    'DtoUpdate
 > {
  ',
    IF (
      @hasCode,
      CONCAT ('readonly #service: I', @entityName, 'Service;'),
      ''
    ),
    '

  constructor(service: I',
    @entityName,
    'Service) {
    super(service);
    ',
    IF (@hasCode, CONCAT ('this.#service = service;'), ''),
    '
  }

  ',
    IF (
      @hasCode,
      CONCAT (
        'generateNewCode = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const newCode: string = await this.#service.generateNewCode("',
        @codePrefix,
        '");
      return res.send(newCode);
    } catch (error) {
      next(error);
    }
  }'
      ),
      ''
    ),
    '
}

  '
  ) AS Controller,
  -- Startup
  CONCAT (
    '
export const ',
    @entityNameLower,
    'Repo = new Mysql',
    @entityName,
    'Repo();
export const ',
    @entityNameLower,
    'Service = new ',
    @entityName,
    'Service(',
    @entityNameLower,
    'Repo);
export const ',
    @entityNameLower,
    'Controller = new ',
    @entityName,
    'Controller(',
    @entityNameLower,
    'Service);
'
  ) AS Startup,
  -- Router
  CONCAT (
    '
import { Router } from "express";
import { authorize } from "../middleware/authorization";
import { ',
    @entityNameLower,
    'Controller } from "../startup";

const ',
    @entityNameLower,
    'Router = Router();

',
    @entityNameLower,
    'Router.get("/pagination", ',
    @entityNameLower,
    'Controller.getPagination);
',
    IF (
      @hasCode,
      CONCAT (
        @entityNameLower,
        'Router.get("/new-code", ',
        @entityNameLower,
        'Controller.generateNewCode);'
      ),
      ''
    ),
    @entityNameLower,
    'Router.get("/:id", ',
    @entityNameLower,
    'Controller.getById);
',
    @entityNameLower,
    'Router.get("/", ',
    @entityNameLower,
    'Controller.get);
',
    @entityNameLower,
    'Router.post("/", authorize, ',
    @entityNameLower,
    'Controller.create);
',
    @entityNameLower,
    'Router.put("/:id", authorize, ',
    @entityNameLower,
    'Controller.update);
',
    @entityNameLower,
    'Router.delete("/:id", authorize, ',
    @entityNameLower,
    'Controller.delete);

export default ',
    @entityNameLower,
    'Router;

  '
  ) AS Router;