import { get } from 'svelte/store';
import { COOKIE_EXPIRATION_DAYS } from './constants';
import { NECESSARY_COOKIES } from './cookieLib';
import { configuredServices } from './store';
import type { SupportedService } from './types';

/*
 * General utils for managing cookies in Typescript.
 * Source: https://gist.github.com/joduplessis/7b3b4340353760e945f972a69e855d11
 */

export function getCookie(name: string): string | undefined {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');

    if (parts?.length == 2) {
        return parts?.pop()?.split(';')?.shift() ?? undefined;
    }
}

export const setCookie = (name: string, val: string, expDays: number): void => {
    const date = new Date();
    const value = val;
    date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + '; expires=' + date.toUTCString() + '; path=/';
};

export function deleteCookie(name: string) {
    const date = new Date();
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
    document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
}


// Check user has all necessary cookies already set
export const hasAllNecessaryCookies = (): boolean => {
    const _configuredServices = get(configuredServices);
    for (let i = 0; i < _configuredServices.length; i++) {
        if (!getCookie(NECESSARY_COOKIES[_configuredServices[i].type]?.name)?.length) {
            return false;
        }
    }
    return true;
};

export const submitNecessaryCookies = (value: 'true' | 'false'): void => {
    const _configuredServices = get(configuredServices)?.map((service) => {
        setCookie(NECESSARY_COOKIES[service.type]?.name, value, COOKIE_EXPIRATION_DAYS);
        return {
            ...service,
            enabled: value === 'true'
        };
    });
    configuredServices.set(_configuredServices)
};

export const isServiceEnabled = (serviceType: SupportedService): boolean => {
    const serviceConfig = get(configuredServices)?.find(
        ({ type }) => type === serviceType
    );
    return serviceConfig?.enabled
};