import * as Pleco from '@dialexa/pleco-knex';
import Knex from 'knex';

import { Entity } from 'src/entities';

export interface FilterSort {
  filter?: Pleco.IFilter;
  sort?: Pleco.ISort;
}

export interface FilterSortPage<TEntity> {
  /** The Pleco filter object */
  filter?: Partial<TEntity> & Pleco.IFilter;
  /**
   * A tuple with the key being a key of the entity and the direction
   * being a sort direction
   */
  sort?: [keyof(TEntity) & string, Pleco.SortDirection];
  /**
   * Cursor pagination information
   */
  page: CursorPaginationInput;
}

export interface PlecoSubqueryResult<V = any, S = any> {
  resourceId: string;
  value: V;
  sort?: S;
}

interface CursorPaginationInput {
  /** The page size */
  first: number;
  /** Encoded cursor data to paginate forwards */
  after?: string;
}

export interface CursorData {
  value: string | boolean | number;
  id: string;
}

export interface PaginatedResultEntry<T> {
  data: T;
  cursor: string;
}

export interface PaginatedResult<T> {
  endCursor?: string;
  data: PaginatedResultEntry<T>[];
  hasNextPage: boolean;
}

export class BaseRepo<TEntity extends Entity> {
  constructor(
    protected knex: Knex,
    protected table: string,
  ) { }

  /**
   * Check if a record exists
   *
   * @param filter the pleco filter to search for
   */
  public async exists(filter: Pleco.IFilter): Promise<boolean> {
    const query = this.getFindManyQuery({ filter });

    const result = await this.knex.raw(`select exists(${query.toString()})`);

    return result.rows[0].exists;
  }

  /**
   * Fetches an entity by the entity's ID
   *
   * @param id the ID of the entity to fetch
   * @returns a promise with the entity
   */
  public async findById(id: string): Promise<TEntity> {
    return await this.queryBuilder().where('id', id).first();
  }

  /**
   * Fetches the first entity by the given conditions
   *
   * @param conditions the conditions to find the entity by
   * @returns a promise that resolves to the entity with the conditions
   */
  public async findFirst(filter: Pleco.IFilter): Promise<TEntity> {
    return await this.getFindManyQuery({ filter }).first();
  }

  /**
   * Fetches a list of entities
   *
   * @param input an object with filter and sort options
   * @returns a promise that resolves to the array of entities
   */
  public async findMany({ filter, sort }: FilterSort = {}): Promise<TEntity[]> {
    return await this.getFindManyQuery({ filter, sort });
  }

  /**
   * Fetches a paginated list of entities by cursor pagination
   *
   * @param input an object with filter, sort, and cursor pagination options
   * @returns a paginated result of the entities
   */
  public async findManyPaginated({ filter, sort, page }: FilterSortPage<TEntity>): Promise<PaginatedResult<TEntity>> {
    const query = this.getFindManyQuery({ filter });

    // Default sort is createdAt asc
    let column = 'createdAt';
    let direction = 'asc';

    if (sort) {
      column = sort[0];
      direction = sort[1];
    }

    query.orderBy([
      { column, order: direction.toLowerCase() },
      { column: 'id', order: 'asc' },
    ]);

    if (page.after) {
      const { value, id } = this.decodeCursor(page.after);

      let operation: string;
      switch (direction.toLowerCase()) {
        case 'asc': operation = '>='; break;
        case 'desc': operation = '<='; break;
        default: throw new Error('Invalid cursor');
      }
      query.where(column, operation, value).andWhere(builder =>
        builder.where(column, operation[0], value).orWhere('id', '>', id));
    }
    query.limit(page.first + 1);

    const result: TEntity[] = await query;
    const hasNextPage = page.first + 1 === result.length;
    if (hasNextPage) {
      result.pop();
    }
    const lastElement = result[result.length - 1];

    return {
      data: result.map(r => ({ data: r, cursor: this.encodeCursor({ value: r[column], id: r.id }) })),
      endCursor: lastElement && this.encodeCursor({ value: lastElement[column], id: lastElement.id }),
      hasNextPage,
    };
  }

  /**
   * Inserts one record
   *
   * @param data the data to insert
   * @returns a promise that resolves to undefined
   */
  public async insertOne(data: Partial<TEntity>): Promise<TEntity> {
    return (await this.insertMany([data]))[0];
  }

  /**
   * Inserts many records
   *
   * @param data the data to insert
   * @returns a promise that resolves to undefined
   */
  public async insertMany(data: Array<Partial<TEntity>>): Promise<TEntity[]> {
    return await this.knex(this.table).insert(data).returning('*');
  }

  /**
   * Updates a record by ID
   *
   * @param id the id of the record to update
   * @param data the data to update
   * @returns a promise that resolves to undefined
   */
  public async updateOne(id: string, data: Partial<TEntity>): Promise<void> {
    await this.queryBuilder().where('id', id).update({ ...data, updatedAt: new Date() } as any);
  }

  /**
   * Deletes all the records in the table
   *
   * @returns a promise that resolves to undefined
   */
  public async deleteAll(): Promise<void> {
    await this.queryBuilder().del();
  }

  public queryBuilder(): Knex.QueryBuilder<TEntity> {
    return this.knex<TEntity>(this.table);
  }

  protected getFilterSubqueries(): Record<string, Knex.QueryBuilder<PlecoSubqueryResult>> {
    return {};
  }

  protected getFindManyQuery({ filter, sort }: FilterSort): Knex.QueryBuilder<TEntity> {
    let query = this.queryBuilder();
    const subqueries = this.getFilterSubqueries();
    if (filter) query = Pleco.getFilterQuery({ filter, subqueries }, { knex: this.knex, query });
    if (sort) query = Pleco.getSortQuery({ sort, subqueries }, { knex: this.knex, query });

    return query;
  }

  private decodeCursor(cursor: string): CursorData {
    return JSON.parse(Buffer.from(cursor, 'base64').toString('ascii'));
  }

  private encodeCursor(input: CursorData): string {
    return Buffer.from(JSON.stringify(input)).toString('base64');
  }
}
