import React, { PureComponent } from "react";
import Card from "../Card/Card";
import { DropTarget } from "react-dnd";
import NewCard from "../NewCard/NewCard";
import EditableText from "../../EditableText/EditableText";
import Dropdown from "../../Dropdown/Dropdown";

import "./List.scss";

const listTarget = {
  drop(props, monitor) {
    // props.moveCard();
    const id = monitor.getItem().id;
    const inList = monitor.getItem().inList;
    console.log(props);
    props.changeCardList(inList, props.index, id);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class List extends PureComponent {
  state = {
    adding: false,
    newCardText: ""
  };

  toggleProp = prop => {
    this.setState({
      [prop]: !this.state[prop]
    });
  };

  closeProp = prop => {
    this.setState({
      [prop]: false
    });
  };

  onCardChangeHandler = e => {
    console.log(e.target.value);
    this.setState({ newCardText: e.target.value });
  };

  onSubmitCardHandler = event => {
    event.preventDefault();
    this.props.addCard(this.props.list._id, this.state.newCardText);
    this.setState({ adding: false, newCardText: "" });
  };

  onSubmitTitleHandler = text => {
    this.props.changeListTitle(this.props.list._id, text);
  };

  render() {
    return this.props.connectDropTarget(
      <div className="List scrollbar">
        <div className="List-Header">
          <EditableText
            text={this.props.list.title}
            onSubmitHandler={this.onSubmitTitleHandler}
            textClasses="List-Title"
          />
          <Dropdown
            classes="List-Controls Board-Controls"
            buttonClasses="btn-invisible List-Controls--Button"
            iconClasses="fas fa-ellipsis-h"
          >
            <ul className="List-Controls--Menu">
              <li className="Board-Controls--Item">
                <button
                  className="Board-Controls--Action btn-invisible"
                  onClick={() => this.toggleProp("adding")}
                >
                  Add Card
                </button>
              </li>
              <li className="Board-Controls--Item">
                <button
                  className="Board-Controls--Action btn-invisible"
                  onClick={() => this.props.deleteList(this.props.list._id)}
                >
                  Delete List
                </button>
              </li>
            </ul>
          </Dropdown>
          {/*  */}
        </div>
        <div className="List-Cards">
          {this.state.adding ? (
            <NewCard
              value={this.state.newCardText}
              onChange={this.onCardChangeHandler}
              onSubmitHandler={this.onSubmitCardHandler}
              listIndex={this.props.index}
              handleClickOutside={() => this.closeProp("adding")}
            />
          ) : null}
          {this.props.list.cards.map(card => (
            <Card
              changeCardText={this.props.changeCardText}
              key={`card-${card._id}`}
              deleteCard={this.props.deleteCard}
              {...card}
            />
          ))}
          {this.props.isOver ? <div className="Card" /> : null}
        </div>
      </div>
    );
  }
}

export default DropTarget("CARD", listTarget, collect)(List);
