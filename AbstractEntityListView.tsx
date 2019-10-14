import {Button, Container, Table, TableBody, TableHeader, TableRow} from "semantic-ui-react";
import React, {ReactElement, RefObject} from "react";
import AbstractRestService from "./AbstractRestService";
import Entity from "./Entity";
import AbstractEntityModal, {EntityModalProps, EntityModalState} from "./AbstractEntityModal";

export interface EntityListViewProps {
    addEntityButtonTitle: string
}

export interface EntityListViewState<T extends Entity> {
    entities: T[]
}


export default abstract class AbstractEntityListView<T extends Entity,
    ID,
    P extends EntityListViewProps,
    S extends EntityListViewState<T>,
    R extends AbstractRestService<T, ID>,
    MP extends EntityModalProps, MS extends EntityModalState<T>,
    M extends AbstractEntityModal<T, MP, MS>>

    extends React.Component<P, S> {
    protected readonly entityService: R;
    protected readonly entityModal: ReactElement<M>;
    protected readonly entityModalRef: RefObject<M>;

    protected constructor(props: P) {
        super(props);
        this.state = this.initState();

        this.onSaveEntity = this.onSaveEntity.bind(this);

        this.entityService = this.initService();

        this.entityModalRef = React.createRef();
        this.entityModal = this.initModal();

    }

    componentDidMount(): void {
        this.entityService.findAll()
            .then(value => this.setState({entities: value}));
    }

    render() {
        return ([
            <Container textAlign={"right"}>
                <Button
                    primary
                    onClick={() => this.configureModal()}>
                    {this.props.addEntityButtonTitle}
                </Button>
            </Container>,
            <Table selectable>
                {this.renderTableHeader()}
                {this.renderTableBody()}

            </Table>,
            this.entityModal
        ])
    }

    abstract renderTableHeader: () => ReactElement<typeof TableHeader>;

    renderTableBody = (): ReactElement<typeof TableBody> =>
        <TableBody>
            {this.state.entities.map(this.renderEntityRow)}
        </TableBody>;

    abstract renderEntityRow: (entity: T) => ReactElement<typeof TableRow>;

    protected abstract initState(): S

    protected abstract initService(): R

    protected abstract initModal(): ReactElement<M>

    protected configureModal(entity: T = this.entityGenerator()): void {
        if (!this.entityModalRef.current) {
            console.log("Error: Modal is null");
            return;
        }
        this.entityModalRef.current.setState({
            entity: this.entityService.clone(entity)
        });
        this.entityModalRef.current.open();
    }

    protected abstract entityGenerator(): T

    protected onSaveEntity(entity: T) {
        let entities: T[] = this.state.entities;

        let idx = entities.findIndex(e => e.id === entity.id);
        entities[idx] = entity;

        this.setState({
            entities: entities
        })
    };
}
