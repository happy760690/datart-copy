/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Input, Space, Form } from 'antd';
import { FormItemEx } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ChartDataSectionField } from 'app/types/ChartConfig';
import { getColumnRenderOriginName } from 'app/utils/internalChartHelper';
import { updateBy } from 'app/utils/mutation';
import debounce from 'debounce-promise';
import { DEFAULT_DEBOUNCE_WAIT } from 'globalConstants';
import { FC, useState } from 'react';
import styled from 'styled-components/macro';

const AliasAction: FC<{
  config: ChartDataSectionField;
  onConfigChange: (config: ChartDataSectionField) => void;
}> = ({ config, onConfigChange }) => {
  const formItemLayout = {
    labelAlign: 'right' as any,
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };
  const t = useI18NPrefix(`viz.palette.data.actions`);
  const [aliasName, setAliasName] = useState(config?.alias?.name);
  const [nameDesc, setNameDesc] = useState(config?.alias?.desc);
  const REGEX = /^[a-zA-Z\u4e00-\u9fff][a-zA-Z0-9_\u4e00-\u9fff]{0,19}$/;

  const onChange = (alias, desc) => {
    const newConfig = updateBy(config, draft => {
      draft.alias = { name: alias, desc: desc };
    });
    setAliasName(alias);
    setNameDesc(desc);
    onConfigChange?.(newConfig);
  };

  return (
    <StyledAliasAction direction="vertical">
      <FormItemEx {...formItemLayout} label={t('alias.fieldName')}>
        {getColumnRenderOriginName(config)}
      </FormItemEx>
      <Form.Item
        {...formItemLayout}
        label={t('alias.name')}
        name="alias.name"
        rules={[
          {
            validator: debounce((_, value) => {
              if ( value && !REGEX.test(value)) {
                return Promise.reject(
                  '20个字符以内，必须是中文或英文开头，可包含中文、数字、英文字母、_',
                );
              }
            }, DEFAULT_DEBOUNCE_WAIT),
          },
        ]}
      >
        <Input
          value={aliasName}
          onChange={({ target: { value } }) => {
            onChange(value, nameDesc);
          }}
        />
      </Form.Item>
      <Form.Item 
        {...formItemLayout} 
        label={t('alias.description')}
        name="alias.description"
        rules={[
          {
            validator: debounce((_, value) => {
              if ( value && value.length > 200) {
                return Promise.reject(
                  '字符限制200以内',
                );
              }
            }, DEFAULT_DEBOUNCE_WAIT),
          },
        ]}
      >
        <Input.TextArea
          value={nameDesc}
          onChange={({ target: { value } }) => {
            onChange(aliasName, value);
          }}
          placeholder='限制200字符'
        />
      </Form.Item>
    </StyledAliasAction>
  );
};

export default AliasAction;

const StyledAliasAction = styled(Space)`
  width: 100%;
`;
