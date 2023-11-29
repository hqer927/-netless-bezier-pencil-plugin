import * as React from "react";
// copy from white-web-sdk/floatBar/Button.tsx
export class Button extends React.Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "didUnmount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "onMouseDown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (event) => {
                const leftButton = 0;
                if (event.button === leftButton) {
                    this.setState({ isPressed: true });
                    const onMouseUp = (event) => {
                        if (event.button === leftButton) {
                            document.body.removeEventListener("mouseup", onMouseUp);
                            if (!this.didUnmount) {
                                this.setState({ isPressed: false });
                            }
                        }
                    };
                    document.body.addEventListener("mouseup", onMouseUp);
                }
            }
        });
        this.state = {
            isHover: false,
            isPressed: false,
        };
    }
    componentWillUnmount() {
        this.didUnmount = true;
    }
    render() {
        let { className } = this.props;
        if (className !== undefined) {
            className = "button " + className;
        }
        else {
            className = "button";
        }
        if (this.props.disable) {
            className += " disable";
        }
        const { refObject } = this.props;
        return (React.createElement("div", { className: className, ref: refObject, onMouseEnter: () => this.setState({ isHover: true }), onMouseLeave: () => this.setState({ isHover: false }), onMouseDown: this.onMouseDown, onTouchEnd: this.props.onClick, onClick: this.props.onClick }, this.props.children));
    }
}
