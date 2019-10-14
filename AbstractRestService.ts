import axios, {AxiosInstance} from "axios";
import {BACKEND_REST, DELETE, DELETE_BY_ID, FIND_ALL, FIND_BY_EXAMPLE, FIND_BY_ID, SAVE} from "./routes";
import * as path from "path";


export default abstract class AbstractRestService<T, ID> {
    protected restService: any;
    private readonly basePath: string;


    public constructor(basePath: string) {
        this.basePath = basePath;
    }

    public getRestClient(): AxiosInstance {
        if (!this.restService) {
            this.restService = axios.create({
                baseURL: BACKEND_REST + this.basePath,
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        }

        return this.restService;
    }

    protected abstract entityGenerator(): T

    public fromJson(json: any): T {
        let entity: T = this.entityGenerator();
        Object.assign(entity, json);
        return entity;
    }

    public clone(entity: T): T {
        return this.fromJson(JSON.parse(JSON.stringify(entity)));
    }

    public async findById(id: ID): Promise<T> {
        let data = (await this.getRestClient()
            .get(path.join(FIND_BY_ID, id + "")))
            .data;

        return this.fromJson(data);
    }

    public async findAll(): Promise<Array<T>> {
        return (await this.getRestClient()
            .get(FIND_ALL))
            .data
            .map((value: string) => this.fromJson(value));
    }

    public async findByExample(dto: T): Promise<Array<T>> {
        return (await this.getRestClient()
            .get(FIND_BY_EXAMPLE))
            .data
            .map(this.fromJson);
    }

    public async save(dto: T) {
        return (await this.getRestClient()
            .post(SAVE, dto))
            .data
    }

    public async deleteById(id: ID) {
        return (await this.getRestClient()
            .delete(path.join(DELETE_BY_ID, id + "")))
            .data
    }

    public async delete(dto: T) {
        return (await this.getRestClient()
            .post(DELETE, dto))
            .data
    }
}