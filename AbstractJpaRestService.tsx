import axios, {AxiosInstance} from "axios";
import {BACKEND_REST, DELETE, DELETE_BY_ID, FIND_ALL, FIND_BY_EXAMPLE, FIND_BY_ID, SAVE} from "./routes";
import * as path from "path";


export default abstract class AbstractJpaRestService<DTO, ID> {
    protected serviceInstance: any;
    private readonly basePath: string;


    public constructor(basePath: string) {
        this.basePath = basePath;
    }

    public getRestClient(): AxiosInstance {
        if (!this.serviceInstance) {
            this.serviceInstance = axios.create({
                baseURL: BACKEND_REST + this.basePath,
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        }

        return this.serviceInstance;
    }

    public async findById(id: ID): Promise<DTO> {
        return (await this.getRestClient()
            .get(path.join(FIND_BY_ID, id + "")))
            .data;
    }

    public async findAll(): Promise<Array<DTO>> {
        return (await this.getRestClient()
            .get(FIND_ALL))
            .data;
    }

    public async findByExample(dto: DTO): Promise<Array<DTO>> {
        return (await this.getRestClient()
            .get(FIND_BY_EXAMPLE))
            .data;
    }

    public async save(dto: DTO) {
        return (await this.getRestClient()
            .post(SAVE, dto))
            .data
    }

    public async deleteById(id: ID) {
        return (await this.getRestClient()
            .delete(path.join(DELETE_BY_ID, id + "")))
            .data
    }

    public async delete(dto: DTO) {
        return (await this.getRestClient()
            .post(DELETE, dto))
            .data
    }

    /*
        public abstract findAllById(ids: Array<ID>): Array<BaseDTO>;

        public abstract saveAll(entities: Array<BaseDTO>): Array<BaseDTO> ;

        public abstract deleteInBatch(entities: Array<BaseDTO>): void;

        public abstract deleteAllInBatch(): void;
    */

}