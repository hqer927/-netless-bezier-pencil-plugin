/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { IconURL } from "../icons";
import { EmitEventType, InternalMsgEmitterType } from "../../plugin/types";
import { MethodBuilderMain } from "../../core/msgEvent";
import { Storage_Selector_key } from "../../collector";
import { EToolsKey } from "../../core";
import isEqual from "lodash/isEqual";
import { DisplayerContext } from "../../plugin/displayerView";
import isBoolean from "lodash/isBoolean";
import Draggable from "react-draggable";
import throttle from "lodash/throttle";
import { SpeechBalloonPlacements } from "../const";
const InputNumberBtn = (props) => {
    const { icon, min, max, step, value, onInputHandler } = props;
    const [num, setNum] = useState(0);
    const ref = useRef(null);
    const checkValue = (number) => {
        if (number > max)
            number = max;
        if (number < min)
            number = min;
        setNum(number);
        onInputHandler(number);
        if (ref.current) {
            ref.current.value = number.toString();
        }
    };
    useEffect(() => {
        if (value) {
            setNum(value);
            if (ref.current) {
                ref.current.value = value.toString();
            }
        }
    }, [value]);
    return (React.createElement("div", { className: "button input-button", onTouchEnd: (e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
        }, onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
        } },
        React.createElement("img", { src: IconURL(icon) }),
        React.createElement("input", { className: "input-number", type: "text", ref: ref, onTouchEnd: () => {
                if (ref.current) {
                    ref.current.focus();
                }
            }, onClick: () => {
                if (ref.current) {
                    ref.current.focus();
                }
            }, onKeyDown: (e) => {
                if (e.key === 'Backspace') {
                    // 获取光标位置
                    const selection = window.getSelection();
                    const range = selection?.getRangeAt(0);
                    // 检查是否有选区文本，如果有则正常删除
                    if (range?.collapsed) {
                        e.preventDefault();
                        // 执行删除操作，这里可以根据具体需求调整删除逻辑
                        document.execCommand('delete', false);
                        return false;
                    }
                }
            }, onKeyUp: () => {
                if (ref.current) {
                    const value = ref.current.value;
                    const number = parseInt(value);
                    if (!isNaN(number)) {
                        ref.current.value = number.toString();
                    }
                    else {
                        ref.current.value = '0';
                    }
                }
            }, onChange: (e) => {
                const value = e.target.value;
                const number = parseInt(value);
                if (number && number && number >= min && number <= max) {
                    checkValue(number);
                }
            } }),
        React.createElement("div", { className: "input-number-btns" },
            React.createElement("div", { className: "input-number-add", onClick: () => {
                    checkValue(num + step);
                }, onTouchEnd: () => {
                    checkValue(num + step);
                } }),
            React.createElement("div", { className: "input-number-cut", onClick: () => {
                    checkValue(num - step);
                }, onTouchEnd: () => {
                    checkValue(num - step);
                } }))));
};
const InputRangeBtn = (props) => {
    const { icon, min, max, step, value, onInputHandler } = props;
    return (React.createElement("div", { className: "button input-button" },
        React.createElement("img", { src: IconURL(icon) }),
        React.createElement(InputRangeUIBtn, { min: min, max: max, step: step, value: value, onInputHandler: onInputHandler })));
};
const InputRangeUIBtn = (props) => {
    const { value, min, max, onInputHandler } = props;
    const [position, setPosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        setPosition({ x: value * 100, y: 0 });
    }, []);
    const onDragHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        let isRightX = Math.floor(Math.max(pos.x, min * 100));
        isRightX = Math.floor(Math.min(isRightX, max * 100));
        if (pos.x !== position?.x) {
            setPosition({ x: isRightX, y: 0 });
        }
        const curValue = isRightX / 100;
        console.log('first1--doing', pos, pos.x, isRightX, curValue);
        if (value !== curValue) {
            onInputHandler(curValue);
        }
    }, 100, { 'leading': false });
    const onDragStartHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const onDragEndHandler = throttle((e, pos) => {
        e.preventDefault();
        e.stopPropagation();
        let isRightX = Math.floor(Math.max(pos.x, min * 100));
        isRightX = Math.floor(Math.min(isRightX, max * 100));
        if (pos.x !== position?.x) {
            setPosition({ x: isRightX, y: 0 });
        }
        const curValue = isRightX / 100;
        console.log('first1--end', pos, pos.x, isRightX, curValue);
        if (value !== curValue) {
            onInputHandler(curValue);
        }
    }, 100, { 'leading': false });
    console.log('position', position);
    return (React.createElement("div", { className: 'range-number-container', onClick: (e) => {
            const x = e.nativeEvent.offsetX - 6;
            let isRightX = Math.floor(Math.max(x, min * 100));
            isRightX = Math.floor(Math.min(isRightX, max * 100));
            setPosition({ x: isRightX, y: 0 });
            const curValue = isRightX / 100;
            console.log('first1', e.nativeEvent.offsetX, isRightX, curValue);
            if (value !== curValue) {
                onInputHandler(curValue);
            }
        } },
        React.createElement("div", { className: "range-number-color" }),
        React.createElement("div", { className: "range-number" },
            React.createElement(Draggable, { bounds: "parent", axis: "x", position: position, onDrag: onDragHandler, onStart: onDragStartHandler, onStop: onDragEndHandler },
                React.createElement("div", { className: "circle", onClick: onDragStartHandler })))));
};
const SelectPlacementBtn = (props) => {
    const { icon, value, onChangeHandler, style } = props;
    const [optionIndex, setOptionIndex] = useState(0);
    const [showSubBtn, setShowSubBtn] = useState();
    const ref = useRef(null);
    const checkValue = useCallback((index) => {
        if (index >= SpeechBalloonPlacements.length)
            index = 0;
        if (index < 0)
            index = SpeechBalloonPlacements.length - 1;
        setOptionIndex(index);
        onChangeHandler(SpeechBalloonPlacements[index]);
        setShowSubBtn(false);
        if (ref.current) {
            ref.current.value = SpeechBalloonPlacements[index];
        }
    }, [onChangeHandler]);
    const subBtnStyle = useMemo(() => {
        if (style && style.bottom) {
            const value = {};
            value.top = 'inherit';
            value.bottom = 50;
            return value;
        }
        return undefined;
    }, [style]);
    useEffect(() => {
        if (value) {
            setOptionIndex(SpeechBalloonPlacements.indexOf(value));
            if (ref.current) {
                ref.current.value = value;
            }
        }
    }, [value]);
    const SubBtnUI = useMemo(() => {
        if (showSubBtn) {
            return React.createElement(SelectOptionBtns, { options: SpeechBalloonPlacements, onClickHandler: checkValue, style: subBtnStyle });
        }
        return null;
    }, [showSubBtn, checkValue, subBtnStyle]);
    return (React.createElement("div", { className: "button input-button" },
        React.createElement("img", { src: IconURL(icon) }),
        React.createElement("input", { readOnly: true, className: "input-number", type: "text", ref: ref, onTouchEnd: () => {
                if (ref.current) {
                    ref.current.focus();
                    // setShowSubBtn(!showSubBtn);
                }
            }, onClick: () => {
                if (ref.current) {
                    ref.current.focus();
                    setShowSubBtn(!showSubBtn);
                }
            } }),
        React.createElement("div", { className: "input-number-btns" },
            React.createElement("div", { className: "input-number-add", onClick: () => {
                    checkValue(optionIndex + 1);
                }, onTouchEnd: () => {
                    checkValue(optionIndex + 1);
                } }),
            React.createElement("div", { className: "input-number-cut", onClick: () => {
                    checkValue(optionIndex - 1);
                }, onTouchEnd: () => {
                    checkValue(optionIndex - 1);
                } })),
        SubBtnUI));
};
const SelectOptionBtns = (props) => {
    const { options, style, onClickHandler } = props;
    return (React.createElement("div", { className: "select-option-menu", style: style, onTouchEnd: (e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
        }, onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
        } }, options.map((s, index) => (React.createElement("div", { className: "select-option-btn", key: s, onClick: () => { onClickHandler(index); }, onTouchEnd: () => { onClickHandler(index); } }, s)))));
};
const StarFormView = (props) => {
    const { maranger, innerRatio, innerVerticeStep, vertices } = props;
    const onInputVerticesHandler = (vertices) => {
        console.log('onInputHandler', vertices);
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.SetShapeOpt, { workIds: [Storage_Selector_key], toolsType: EToolsKey.Star,
            viewId: maranger.viewId, vertices });
    };
    const onInputInnerVertexHandler = (innerVerticeStep) => {
        console.log('onInputHandler', innerVerticeStep);
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.SetShapeOpt, { workIds: [Storage_Selector_key], toolsType: EToolsKey.Star,
            viewId: maranger.viewId, innerVerticeStep });
    };
    const onInputInnerRatioHandler = (innerRatio) => {
        console.log('onInputHandler', innerRatio);
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.SetShapeOpt, { workIds: [Storage_Selector_key], toolsType: EToolsKey.Star,
            viewId: maranger.viewId, innerRatio });
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(InputNumberBtn, { value: vertices, icon: "polygon-vertex", min: 3, max: 100, step: 1, onInputHandler: onInputVerticesHandler }),
        React.createElement(InputNumberBtn, { value: innerVerticeStep, icon: "star-innerVertex", min: 1, max: 100, step: 1, onInputHandler: onInputInnerVertexHandler }),
        React.createElement(InputRangeBtn, { value: innerRatio, icon: "star-innerRatio", min: 0.1, max: 1, step: 0.1, onInputHandler: onInputInnerRatioHandler })));
};
const PolygonFormView = (props) => {
    const { maranger, vertices } = props;
    const onInputHandler = (vertices) => {
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.SetShapeOpt, { workIds: [Storage_Selector_key], toolsType: EToolsKey.Polygon,
            viewId: maranger.viewId, vertices });
    };
    return (React.createElement(InputNumberBtn, { value: vertices, icon: "polygon-vertex", min: 3, max: 100, step: 1, onInputHandler: onInputHandler }));
};
const SpeechBalloonFormView = (props) => {
    const { maranger, placement } = props;
    const onChangeHandler = (placement) => {
        console.log('onChangeHandler-SpeechBalloonFormView', placement);
        MethodBuilderMain.emitMethod(InternalMsgEmitterType.MainEngine, EmitEventType.SetShapeOpt, { workIds: [Storage_Selector_key], toolsType: EToolsKey.SpeechBalloon,
            viewId: maranger.viewId, placement });
    };
    return (React.createElement(SelectPlacementBtn, { value: placement, icon: "speechBallon-placement", onChangeHandler: onChangeHandler }));
};
const SubTab = (props) => {
    const { icon, isActive, onClickHandler, onTouchEndHandler } = props;
    return (React.createElement("div", { className: `button tab-button ${isActive ? "active" : ""}`, onClick: onClickHandler, onTouchEnd: onTouchEndHandler },
        React.createElement("img", { src: IconURL(icon) })));
};
const SubBtns = (props) => {
    const { toolsTypes, style, maranger, shapeOpt } = props;
    const [toolsType, setToolsType] = useState();
    useEffect(() => {
        if (toolsTypes.includes(EToolsKey.Polygon)) {
            setToolsType(EToolsKey.Polygon);
        }
        else if (toolsTypes.includes(EToolsKey.Star)) {
            setToolsType(EToolsKey.Star);
        }
        else {
            setToolsType(EToolsKey.SpeechBalloon);
        }
    }, [toolsTypes]);
    const onClickTabHandler = (type, e) => {
        e?.preventDefault();
        e?.stopPropagation();
        setToolsType(type);
    };
    const PolygonForm = useMemo(() => {
        if (toolsType === EToolsKey.Polygon && maranger && shapeOpt.vertices) {
            return React.createElement(PolygonFormView, { vertices: shapeOpt.vertices, maranger: maranger });
        }
        return null;
    }, [maranger, toolsType, shapeOpt]);
    const StarForm = useMemo(() => {
        if (toolsType === EToolsKey.Star && maranger && shapeOpt.vertices && shapeOpt.innerVerticeStep && shapeOpt.innerRatio) {
            return React.createElement(StarFormView, { maranger: maranger, vertices: shapeOpt.vertices, innerVerticeStep: shapeOpt.innerVerticeStep, innerRatio: shapeOpt.innerRatio });
        }
        return null;
    }, [maranger, toolsType, shapeOpt]);
    const SpeechBalloonForm = useMemo(() => {
        if (toolsType === EToolsKey.SpeechBalloon && maranger && shapeOpt.placement) {
            return React.createElement(SpeechBalloonFormView, { maranger: maranger, placement: shapeOpt.placement });
        }
        return null;
    }, [maranger, toolsType, shapeOpt]);
    return (React.createElement("div", { className: "shapeOpt-sub-menu", style: style, onClick: (e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            e?.preventDefault();
        } },
        React.createElement("div", { className: "shapeOpt-sub-menu-tabs" },
            toolsTypes.includes(EToolsKey.Polygon) && React.createElement(SubTab, { isActive: toolsType === EToolsKey.Polygon, icon: toolsType === EToolsKey.Polygon ? "polygon-active" : "polygon", onClickHandler: onClickTabHandler.bind(this, EToolsKey.Polygon), onTouchEndHandler: onClickTabHandler.bind(this, EToolsKey.Polygon) }) || null,
            toolsTypes.includes(EToolsKey.Star) && React.createElement(SubTab, { isActive: toolsType === EToolsKey.Star, icon: toolsType === EToolsKey.Star ? "star-active" : "star", onClickHandler: onClickTabHandler.bind(this, EToolsKey.Star), onTouchEndHandler: onClickTabHandler.bind(this, EToolsKey.Star) }) || null,
            toolsTypes.includes(EToolsKey.SpeechBalloon) && React.createElement(SubTab, { isActive: toolsType === EToolsKey.SpeechBalloon, icon: toolsType === EToolsKey.SpeechBalloon ? "speechBallon-active" : "speechBallon", onClickHandler: onClickTabHandler.bind(this, EToolsKey.SpeechBalloon), onTouchEndHandler: onClickTabHandler.bind(this, EToolsKey.SpeechBalloon) }) || null),
        React.createElement("div", { className: "shapeOpt-sub-menu-content" },
            PolygonForm,
            StarForm,
            SpeechBalloonForm)));
};
export const ShapeOpt = (props) => {
    const { open: showSubBtn, setOpen: setShowSubBtn, floatBarRef, toolsTypes, shapeOpt } = props;
    const { floatBarData, maranger, position } = useContext(DisplayerContext);
    const [selectIds, setSelectIds] = useState([]);
    const [oldDisableDeviceInputs, setOldDisableDeviceInputs] = useState();
    const subBtnStyle = useMemo(() => {
        if (floatBarRef?.current && position && maranger?.height) {
            if (floatBarRef.current.offsetTop && floatBarRef.current.offsetTop + position.y > 200) {
                const value = {};
                value.top = 'inherit';
                value.bottom = 50;
                return value;
            }
            else if (!floatBarRef.current.offsetTop && maranger?.height - floatBarRef.current.offsetTop - position.y < 140) {
                const value = {};
                value.top = 'inherit';
                value.bottom = 50;
                return value;
            }
        }
        return undefined;
    }, [floatBarRef, position, maranger]);
    const SubBtnUI = useMemo(() => {
        if (showSubBtn && toolsTypes && maranger && shapeOpt) {
            if (maranger.control.room && !maranger.control.room.disableDeviceInputs) {
                setOldDisableDeviceInputs(maranger.control.room.disableDeviceInputs);
                maranger.control.room.disableDeviceInputs = true;
            }
            return React.createElement(SubBtns, { shapeOpt: shapeOpt, style: subBtnStyle, toolsTypes: toolsTypes, maranger: maranger });
        }
        if (maranger?.control.room && isBoolean(oldDisableDeviceInputs)) {
            maranger.control.room.disableDeviceInputs = oldDisableDeviceInputs;
            console.log('showSubBtn---false---001', showSubBtn);
        }
        return null;
    }, [showSubBtn, subBtnStyle, toolsTypes, maranger, shapeOpt]);
    const onClickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        const isActive = !showSubBtn;
        setShowSubBtn(isActive);
    };
    const onTouchEndHandler = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        const isActive = !showSubBtn;
        setShowSubBtn(isActive);
    };
    useEffect(() => {
        if (!isEqual(floatBarData?.selectIds, selectIds)) {
            if (floatBarData?.selectIds && !isEqual(floatBarData?.selectIds, selectIds)) {
                setSelectIds(floatBarData?.selectIds);
                setShowSubBtn(false);
            }
        }
    }, [showSubBtn, floatBarData, selectIds, setShowSubBtn]);
    useEffect(() => {
        return () => {
            if (showSubBtn) {
                if (maranger?.control.room && isBoolean(oldDisableDeviceInputs)) {
                    maranger.control.room.disableDeviceInputs = oldDisableDeviceInputs;
                    console.log('showSubBtn---false---002', showSubBtn);
                }
            }
        };
    }, [showSubBtn, maranger, oldDisableDeviceInputs]);
    return (React.createElement("div", { className: `button normal-button ${showSubBtn && 'active'}`, onClick: onClickHandler, onTouchEnd: onTouchEndHandler },
        SubBtnUI,
        React.createElement("img", { alt: "icon", src: IconURL(showSubBtn ? 'shapes-active' : 'shapes') })));
};
