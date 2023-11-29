import * as React from "react";

export type ButtonProps = {
    readonly className?: string;
    readonly disable?: boolean;
    readonly refObject?: React.RefObject<HTMLDivElement>;
    readonly onClick: () => void;
    readonly children: React.ReactNode;
};

export type ButtonState = {
    readonly isHover: boolean;
    readonly isPressed: boolean;
};

// copy from white-web-sdk/floatBar/Button.tsx
export class Button extends React.Component<ButtonProps, ButtonState> {

    private didUnmount: boolean = false;

    public constructor(props: ButtonProps) {
        super(props);
        this.state = {
            isHover: false,
            isPressed: false,
        };
    }

    public componentWillUnmount(): void {
        this.didUnmount = true;
    }

    private onMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
        const leftButton = 0;
        if (event.button === leftButton) {
            this.setState({ isPressed: true });
            const onMouseUp = (event: MouseEvent): void => {
                if (event.button === leftButton) {
                    document.body.removeEventListener("mouseup", onMouseUp);
                    if (!this.didUnmount) {
                        this.setState({ isPressed: false });
                    }
                }
            };
            document.body.addEventListener("mouseup", onMouseUp);
        }
    };

    public render(): React.ReactNode {
        let { className } = this.props;
        if (className !== undefined) {
            className = "button " + className;
        } else {
            className = "button";
        }
        if (this.props.disable) {
            className += " disable";
        }
        const { refObject } = this.props;
        return (
            <div className={className}
                 ref={refObject}
                 onMouseEnter={() => this.setState({ isHover: true })}
                 onMouseLeave={() => this.setState({ isHover: false })}
                 onMouseDown={this.onMouseDown}
                 onTouchEnd={this.props.onClick}
                 onClick={this.props.onClick}>
                {this.props.children}
            </div>
        );
    }

}
