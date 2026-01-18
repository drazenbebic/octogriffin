import { FC } from 'react';

import { FormCheckbox, FormCheckboxProps } from '@ariakit/react';

import { Switch, SwitchProps } from './Switch';

export type FormSwitchProps = Omit<SwitchProps, 'as'> & FormCheckboxProps;

export const FormSwitch: FC<FormSwitchProps> = props => {
  return <Switch as={FormCheckbox} {...props} />;
};
