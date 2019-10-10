import {Button, Modal, ModalActions, ModalContent} from "semantic-ui-react";
import React, {Component, ReactElement} from "react";
import Entity from "./Entity";

export enum ViewMode {
    ADD,
    EDIT
}

export interface EntityModalProps {
    onSave: any

    saveButtonCaption: string
    cancelButtonCaption: string
}

export interface EntityModalState<T> {
    open: boolean

    entity: T
}

export default abstract class AbstractEntityModal<T extends Entity, P extends EntityModalProps, S extends EntityModalState<T>> extends Component<P, S> {

    protected constructor(props: P) {
        super(props);

        this.setInitialState = this.setInitialState.bind(this);
        this.state = this.setInitialState();

        this.onSave = this.onSave.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.renderContent = this.renderContent.bind(this);
        this.renderActions = this.renderActions.bind(this);

        this.getEntity = this.getEntity.bind(this);
        this.setEntity = this.setEntity.bind(this);
    }

    protected abstract setInitialState(): S

    onCancel(): void {
        this.close();
    }

    onSave(): void {
        this.props.onSave(this.state.entity);
        this.close();
    }

    public open() {
        this.setState({
            open: true
        });
    }

    public close() {
        this.setState({
            open: false
        });
    }

    protected getEntity(): T {
        return this.state.entity;
    }

    protected setEntity(entity: T): void {
        this.setState({
            entity: entity
        });
    }

    render() {
        return (
            <Modal open={this.state.open} size={"tiny"}>
                {this.renderContent()}
                {this.renderActions()}
            </Modal>
        )
    }

    public abstract renderContent(): ReactElement<typeof ModalContent>

    renderActions(): ReactElement<typeof ModalActions> {
        return (
            <ModalActions>
                <Button primary
                        onClick={this.onSave}>
                    {this.props.saveButtonCaption}
                </Button>
                <Button secondary
                        onClick={this.onCancel}>
                    {this.props.cancelButtonCaption}
                </Button>
            </ModalActions>
        )
    }


}