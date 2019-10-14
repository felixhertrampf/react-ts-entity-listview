import {
    Button,
    Header,
    List,
    ListItem,
    Modal,
    ModalActions,
    ModalContent,
    ModalDescription,
    ModalHeader
} from "semantic-ui-react";
import React, {Component, ReactElement} from "react";
import Entity from "./Entity";

export interface EntityModalProps {
    onSave: any

    saveButtonCaption: string
    cancelButtonCaption: string

    headerTitle: string
    description: string
}

export interface EntityModalState<T> {
    open: boolean
    entity: T
    errors: string[]
}

export default abstract class AbstractEntityModal<T extends Entity,
    P extends EntityModalProps,
    S extends EntityModalState<T>>
    extends Component<P, S> {

    public readonly abstract renderContent: () => ReactElement<typeof ModalContent>;

    protected constructor(props: P) {
        super(props);

        this.setInitialState = this.setInitialState.bind(this);
        this.state = this.setInitialState();
    }

    public readonly open = () => {
        this.setState({
            open: true
        });
    };

    public readonly close = () => {
        this.setState({
            open: false
        });
    };

    render() {
        return (
            <Modal open={this.state.open} size={"tiny"}>
                {this.renderHeader()}
                {this.renderDescription()}
                {this.renderContent()}
                {this.renderErrorList()}
                {this.renderActions()}
            </Modal>)
    }

    renderHeader = (): React.ReactElement<typeof ModalHeader> =>
        <ModalHeader>
            <Header content={this.props.headerTitle}/>
        </ModalHeader>;

    public readonly renderDescription = (): ReactElement<typeof ModalDescription> =>
        <ModalDescription style={{marginTop: 10, marginLeft: 20, marginRight: 20}}>
            <span>{this.props.description}</span>
        </ModalDescription>;

    public readonly renderErrorList = (): ReactElement<typeof List> =>
        <List style={{marginTop: 10, marginLeft: 20, marginRight: 20}}>
            {this.state.errors.map(this.renderErrorListItem)}
        </List>;

    public readonly renderErrorListItem = (error: string): ReactElement<typeof ListItem> =>
        <ListItem>
            <div>{error}</div>
        </ListItem>;

    public readonly renderActions = (): ReactElement<typeof ModalActions> =>
        <ModalActions>
            <Button primary
                    onClick={this.onSave}>
                {this.props.saveButtonCaption}
            </Button>
            <Button secondary
                    onClick={this.onCancel}>
                {this.props.cancelButtonCaption}
            </Button>
        </ModalActions>;

    protected abstract setInitialState(): S

    protected readonly onCancel = () => {
        this.close();
    };

    protected readonly onSave = () => {
        this.props.onSave(this.state.entity);
        this.close();
    };

    protected readonly getEntity = () => {
        return this.state.entity;
    };

    protected readonly setEntity = (entity: T) => {
        this.setState({
            entity: entity
        });
    };

    protected readonly addError = (error: string) => {
        let errors: string[] = this.state.errors;
        this.setState({
            errors: errors.concat(error)
        })
    };

    protected readonly clearErrors = () => {
        // IDK why, but this.setState({errors: []}) doesn't work...
        this.state.errors.length = 0;
    };
}