import Divider from '@mui/material/Divider';
import { observer } from 'mobx-react';
import React from 'react';
import { ColudObjectDetailsProps } from '../../../client';
import { DrawerItem } from '../../template/details/drawer/drawer-item';
import { DrawerItemLabels } from '../../template/details/drawer/drawer-item-labels';
import { Resource } from './store';

export interface DetailsProps extends ColudObjectDetailsProps {
  object: Resource;
}

@observer
export default class Details extends React.Component<ColudObjectDetailsProps> {
  render() {
    const object = this.props.object;
    if (!object) {
      return null;
    }
    return (
      <>
        <Divider />
        <DrawerItem name={'Kind'}>{object.getKind()}</DrawerItem>
        <DrawerItem name={'Name'}>{object.getName()}</DrawerItem>
        <DrawerItem name={'Workspace'}>{object.getNs()}</DrawerItem>
        <DrawerItem name={'Uuid'}>{object.getId()}</DrawerItem>
        <DrawerItemLabels name={'Label'} labels={object.getLabels()} />
      </>
    );
  }
}
