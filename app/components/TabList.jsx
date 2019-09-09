import React, { Component } from "react";

class Tab extends Component {
  onClick = () => {
    const { label, onClick } = this.props;
    onClick(label);
  };

  render() {
    const {
      onClick,
      props: { activeTab, label }
    } = this;

    let className = "nav-item nav-link";

    if (activeTab === label) {
      className += " active";
    }

    return (
      <a className={className} onClick={onClick}>
        {label}
      </a>
    );
  }
}

export default class TabList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: this.props.children[0].props.label
    };
  }

  onClickTabItem = tab => {
    this.setState({ activeTab: tab });
  };

  render() {
    const {
      onClickTabItem,
      props: { children },
      state: { activeTab }
    } = this;

    return (
      <div>
        <nav>
          <div className="nav nav-tabs">
            {children.map(child => {
              if (child == null) return;
              const { label } = child.props;

              return (
                <Tab
                  activeTab={activeTab}
                  key={label}
                  label={label}
                  onClick={onClickTabItem}
                />
              );
            })}
          </div>
        </nav>
        <div className="tab-content">
          <div className="tab-pane show active">
            {children.map(child => {
              if (child == null || child.props.label !== activeTab) return undefined;
              return child.props.children;
            })}
          </div>
        </div>
      </div>
    );
  }
}
