/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './index.module.less';
import { useState, useEffect } from 'react';
import { AimOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export const ZoomController = () => {
    const [scale, setScale] = useState<number>(100)
    const moveTo100 = () => {
        window.room?.moveCamera({
            centerX: 0,
            centerY: 0,
            scale: 1,
        });
        setScale(100);
    }
    useEffect(() => {
        // console.log('scale', scale)
        window.room?.moveCamera({
            centerX: 0,
            centerY: 0,
            scale: scale / 100,
        });
    }, [scale])

    const cutNum = () => {
        setScale(Math.max(scale - 25, 25));
    }
    const addNum = () => {
        setScale(scale + 25);
    }
    return (
        <div className={styles['ZoomController']}>
            <Button.Group>
                <Button icon={<AimOutlined />} onClick={moveTo100}/>
                <Button icon={<PlusOutlined />} onClick={addNum}/>
                <Button>{scale}</Button>
                <Button icon={<MinusOutlined />} onClick={cutNum}/>
            </Button.Group>
        </div>
    )
}