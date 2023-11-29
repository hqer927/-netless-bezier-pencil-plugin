import React from "react";

export const BtnItem = (props: {
  icon: string;
  title: string;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <div className="btn-item button normal-button" onClick={props.onClick}>
      <i className={`iconfont ${props.icon}`} />
      <span>{props.title}</span>
    </div>
  );
};