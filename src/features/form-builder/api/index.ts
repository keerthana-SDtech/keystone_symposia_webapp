import type { FormDefinition } from '../types';
import { httpClient } from '../../../lib/httpClient';

export const formBuilderApi = {
    getConferenceFormConfig: async (): Promise<FormDefinition> => {
        const { data } = await httpClient.get<FormDefinition>('/keystone/form-definitions/conference-proposal');
        return data;
    },
};
