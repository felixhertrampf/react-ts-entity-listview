import {Button, Container, Table, TableBody, TableHeader} from "semantic-ui-react";
import React, {ReactElement} from "react";
import AbstractJpaRestService from "./AbstractJpaRestService";
import Entity from "./Entity";
import AbstractEntityModal, {EntityModalProps, EntityModalState} from "./AbstractEntityModal";

export interface EntityListViewProps {
}

export interface EntityListViewState<T> {
    entities: T[]
}


export default abstract class AbstractEntityListView<T extends Entity,
    ID,
    P extends EntityListViewProps,
    S extends EntityListViewState<T>,
    A extends AbstractJpaRestService<T, ID>,
    MP extends EntityModalProps, MS extends EntityModalState<T>,
    M extends AbstractEntityModal<T, MP, MS>>
    extends React.Component<P, S> {
    protected readonly entityService: A;
    protected readonly entityModalRef: React.RefObject<M>;
    protected readonly entityModal: ReactElement<M>;

    protected constructor(props: P) {
        super(props);
        this.state = this.initState();

        this.configureModal = this.configureModal.bind(this);
        this.renderEntityRow = this.renderEntityRow.bind(this);
        this.onSaveEntity = this.onSaveEntity.bind(this);

        this.entityService = this.initService();
        this.entityModalRef = React.createRef();
        this.entityModal = this.initModal();

    }

    componentDidMount(): void {
        this.entityService.findAll()
            .then(value => this.setState({entities: value}));
    }

    protected abstract initState(): S

    protected abstract initService(): A

    protected abstract initModal(): ReactElement<M>

    protected abstract entityGenerator(): T

    protected onSaveEntity(entity: T) {
        let entities: T[] = this.state.entities;
        console.log(entities);
        console.log(entity);
        let idx = entities.findIndex(e => e.id == entity.id);
        entities[idx] = entity;
        console.log(idx);
        console.log(entities);

        this.setState({
            entities: entities
        })
    }

    render() {
        return ([
            <Container textAlign={"right"}>
                <Button
                    primary
                    onClick={e => {
                        this.configureModal(e)
                    }}>
                    Add Customer
                </Button>
            </Container>,
            <Table selectable>
                {this.renderTableHeader()}
                {this.renderTableBody()}

            </Table>,
            this.entityModal
        ])
    }

    abstract renderTableHeader(): ReactElement<typeof TableHeader>

    renderTableBody(): ReactElement<typeof TableBody> {
        return (
            <TableBody>
                {
                    this.state.entities.map(this.renderEntityRow)
                }
            </TableBody>
        )
    }

    abstract renderEntityRow(entity: T): ReactElement<typeof TableHeader>

    configureModal(e: React.MouseEvent<Element, MouseEvent>, entity: T = this.entityGenerator()) {
        if (!this.entityModalRef.current) {
            console.log("Error: Modal is null");
            return;
        }
        this.entityModalRef.current.setState({
            entity: entity
        });
        this.entityModalRef.current.open();
    }


}
