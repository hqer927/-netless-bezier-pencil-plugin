import React from "react";
import { BarMargin, BarPadding } from "../const";
var FloatBarPosition;
(function (FloatBarPosition) {
    FloatBarPosition[FloatBarPosition["Top"] = 0] = "Top";
    FloatBarPosition[FloatBarPosition["Bottom"] = 1] = "Bottom";
    FloatBarPosition[FloatBarPosition["Left"] = 2] = "Left";
    FloatBarPosition[FloatBarPosition["Right"] = 3] = "Right";
    FloatBarPosition[FloatBarPosition["Center"] = 4] = "Center";
})(FloatBarPosition || (FloatBarPosition = {}));
export class FloatBarImplement extends React.Component {
    // private viewMovingState: ViewMovingState;
    // private disposer?: IReactionDisposer;
    constructor(props) {
        super(props);
        Object.defineProperty(this, "lockView", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (lockedPosition) => {
                this.setState({ lockedPosition });
            }
        });
        this.state = { lockedPosition: undefined };
        // this.viewMovingState = new ViewMovingState(props.rectangle);
    }
    static willInterruptEvent() {
        return true;
    }
    componentDidMount() {
        // let isHiddenBefore = true;
        // this.disposer = autorun((): void => {
        //     if (this.viewMovingState.shouldHideFloatBar) {
        //         if (!isHiddenBefore) {
        //             this.unlockView();
        //             isHiddenBefore = true;
        //         }
        //     } else {
        //         isHiddenBefore = false;
        //     }
        // });
    }
    componentDidUpdate() {
        const { rectangle } = this.props;
        this.viewMovingState.setState(rectangle, this.isEditTextarea());
    }
    componentWillUnmount() {
        this.viewMovingState.release();
        this.disposer?.();
    }
    isEditTextarea() {
        const { components, whiteModel: { TextareaShape } } = this.props;
        for (const component of components) {
            if (isInstanceOf(component, TextareaShape) &&
                component.editedBy !== undefined) {
                return true;
            }
        }
        return false;
    }
    position(rectangle, buttons) {
        const left = rectangle.x;
        const top = rectangle.x;
        const right = left + rectangle.w;
        const bottom = top + rectangle.h;
        let boxWidth = BarPadding.left + BarPadding.right;
        let boxHeight = BarPadding.top + BarPadding.bottom;
        let maxButtonHeight = 0;
        for (const { w, h } of buttons) {
            boxWidth += w;
            maxButtonHeight = Math.max(maxButtonHeight, h);
        }
        boxHeight += maxButtonHeight;
        const floatBarWidth = boxWidth + BarMargin.left + BarMargin.right;
        const floatBarHeight = boxHeight + BarMargin.top + BarMargin.bottom;
        const { screenSize } = this.props;
        const screenWidth = screenSize.width;
        const screenHeight = screenSize.height;
        let position;
        if (top >= floatBarHeight) {
            position = FloatBarPosition.Top;
        }
        else if (screenHeight - bottom >= floatBarHeight) {
            position = FloatBarPosition.Bottom;
        }
        else if (left >= floatBarWidth) {
            position = FloatBarPosition.Left;
        }
        else if (screenWidth - right >= floatBarWidth) {
            position = FloatBarPosition.Right;
        }
        else {
            position = FloatBarPosition.Center;
        }
        return {
            left,
            right,
            top,
            bottom,
            position,
            boxWidth,
            boxHeight,
            width: floatBarWidth,
            height: floatBarHeight,
        };
    }
    centerXWithTopOrBottom(view, screenWidth) {
        const minX = Math.max(view.left, 0.0);
        const maxX = Math.min(view.right, screenWidth);
        const halfWidth = view.width / 2.0;
        let centerX = (minX + maxX) / 2.0;
        if (centerX - halfWidth < 0.0) {
            centerX = halfWidth;
        }
        else if (centerX + halfWidth > screenWidth) {
            centerX = screenWidth - halfWidth;
        }
        return centerX;
    }
    unlockView() {
        this.setState({ lockedPosition: undefined });
    }
    render() {
        const { whiteModel, components, screenSize, rectangle, view, cnode, room } = this.props;
        if (!room || this.viewMovingState.shouldHideFloatBar) {
            return null;
        }
        let floatBarDelegate;
        if (view) {
            floatBarDelegate = view.floatBarDelegate;
        }
        else {
            floatBarDelegate = room.getMainViewIfExits().floatBarDelegate;
        }
        const { lockedPosition } = this.state;
        const buttons = searchButtons({
            viewMovingState: this.viewMovingState,
            isEditTextarea: this.isEditTextarea(),
            whiteModel,
            components,
            delegate: floatBarDelegate,
            colors: room.floatBarOptions.colors,
        });
        if (buttons.length <= 0) {
            return null;
        }
        const barView = lockedPosition || this.position(rectangle, buttons);
        const screenWidth = screenSize.width;
        const screenHeight = screenSize.height;
        let centerX;
        let centerY;
        switch (barView.position) {
            case FloatBarPosition.Top: {
                centerX = this.centerXWithTopOrBottom(barView, screenWidth);
                centerY = barView.top - barView.height / 2.0;
                break;
            }
            case FloatBarPosition.Bottom: {
                centerX = this.centerXWithTopOrBottom(barView, screenWidth);
                centerY = barView.bottom + barView.height / 2.0;
                break;
            }
            case FloatBarPosition.Left: {
                centerX = barView.left - barView.width / 2.0;
                centerY = Math.max(barView.top, 0.0) + barView.height / 2.0;
                break;
            }
            case FloatBarPosition.Right: {
                centerX = barView.right + barView.width / 2.0;
                centerY = Math.max(barView.top, 0.0) + barView.height / 2.0;
                break;
            }
            case FloatBarPosition.Center: {
                const minX = Math.max(barView.left, 0.0);
                const maxX = Math.min(barView.right, screenWidth);
                const minY = Math.max(barView.top, 0.0);
                centerX = (minX + maxX) / 2.0;
                centerY = minY + barView.height / 2.0;
                break;
            }
        }
        const dx = centerX - barView.width / 2.0;
        const dy = centerY - barView.height / 2.0;
        const transform = `translate(${dx}px,${dy}px)`;
        const buttonViews = [];
        let originX = dx;
        for (const { width, node } of buttons) {
            const viewNode = node(originX, dy, barView.boxWidth, barView.boxHeight, screenWidth, screenHeight);
            buttonViews.push(viewNode);
            originX += width;
        }
        return (React.createElement("div", { className: "float-bar", onMouseEnter: () => this.lockView(barView), style: {
                WebkitTransform: transform,
                transform,
                width: barView.boxWidth,
                height: barView.boxHeight,
                padding: 0,
                marginLeft: BarMargin.left,
                marginRight: BarMargin.right,
                marginTop: BarMargin.top,
                marginBottom: BarMargin.bottom,
            } }, buttonViews));
    }
}
