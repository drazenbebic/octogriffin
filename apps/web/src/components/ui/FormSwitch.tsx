import { FC } from 'react';

import { FormCheckbox, FormCheckboxProps } from '@ariakit/react';

import { Switch, SwitchProps } from './Switch';

export type FormSwitchProps = FormCheckboxProps & Omit<SwitchProps, 'as'>;

export const FormSwitch: FC<FormSwitchProps> = props => {
  return <Switch as={FormCheckbox} {...props} />;
};
