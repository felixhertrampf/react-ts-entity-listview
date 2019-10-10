export default abstract class Entity {
    id: number;

    protected constructor(id: number = -1) {
        this.id = id;
    }

}