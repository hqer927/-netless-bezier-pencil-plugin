/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './index.module.less';
import { LogoutOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Room } from 'white-web-sdk';
import { Identity } from '../../replayMulti';
import { WindowManager } from '@netless/window-manager';
import { AppContext } from '../../App';

export const TopTools = () => {
    const {beginAt} = useContext(AppContext);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const navigate = useNavigate();
    const handleGoReplay = () => {
        setConfirmLoading(true);
        setTimeout(async() => {
            setConfirmLoading(false);
            const slice = (window.room as Room).slice;
            const uuid = (window.room as Room).uuid;
            const region = (window.room as Room).region;
            const roomToken = (window.room as Room).roomToken;
            const isWritable = (window.room as Room).isWritable;
            const identity = Identity.Joiner;
            let url = `uuid=${uuid}&region=${region}&roomToken=${roomToken}&isWritable=${isWritable}&identity=${identity}`;
            if(!window.manager){
                (window.room as Room).bindHtmlElement(null);
            }
            await window.room.disconnect();
            if (window.manager) {
                (window.manager as WindowManager).destroy();
                window.manager = undefined;
                const now = Date.now();
                const duration = now - beginAt;
                url = `${url}&duration=${duration}&beginAt=${beginAt}`
                // window.location.hash = `/replayMulti?${url}`;
                navigate(`/replayMulti?${url}`);
                return;
            }
            url = `${url}&slice=${slice}`
            // window.location.hash = `/replaySingle?${url}`;
            navigate(`/replaySingle?${url}`);
        }, 2000);
    }
    const handleGoBack = async() => {
        if(!window.manager){
            (window.room as Room).bindHtmlElement(null);
        }
        await window.room.disconnect();
        if (window.manager) {
            (window.manager as WindowManager).destroy();
            window.manager = undefined;
        } 
        // window.location.hash = `/`;
        navigate('/');
    }
    return (
        <div className={styles['TopTools']}>
            <Button.Group>
                <Popconfirm
                    placement="rightBottom"
                    title={'退出教室'}
                    description={'是否退出教室?'}
                    okText="观看回放"
                    cancelText="直接退出"
                    okButtonProps={{ loading: confirmLoading }}
                    onCancel={handleGoBack}
                    onConfirm={handleGoReplay}
                >
                    <Button icon={<LogoutOutlined />}/>
                </Popconfirm>
            </Button.Group>
        </div>
    )
}