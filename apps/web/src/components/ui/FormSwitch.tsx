import type { FC } from 'react';

import type { FormCheckboxProps } from '@ariakit/react';
import { FormCheckbox } from '@ariakit/react';

import type { SwitchProps } from './Switch';
import { Switch } from './Switch';

export type FormSwitchProps = FormCheckboxProps & Omit<SwitchProps, 'as'>;

export const FormSwitch: FC<FormSwitchProps> = props => {
  return <Switch as={FormCheckbox} {...props} />;
};
