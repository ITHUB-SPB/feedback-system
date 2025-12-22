import {
  matchResourceFromRoute,
  type ParseResponse,
  ResourceContext,
  type GoConfig,
  type RouterProvider,
  type IResourceItem,
} from '@refinedev/core';

import {
  Link,
  useLocation,
  useMatch,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { type ComponentProps, useCallback, useContext, useMemo } from 'react';
import { stringifyQuery } from 'ufo';

export const routerProvider: RouterProvider = {
  go: () => {
    const { search: existingSearch, hash: existingHash } = useLocation();
    const navigate = useNavigate();

    const fn = useCallback(
      ({
        to,
        type,
        query,
        hash,
        options: { keepQuery, keepHash } = {},
      }: GoConfig) => {
        /** Construct query params */
        const urlQuery: Record<string, string> = {
          ...(keepQuery && existingSearch),
          ...query,
        };

        if (urlQuery.to) {
          urlQuery.to = encodeURIComponent(`${urlQuery.to}`);
        }

        const hasUrlQuery = Object.keys(urlQuery).length > 0;

        /** Get hash */
        const urlHash = `#${(hash || (keepHash && existingHash) || '').replace(
          /^#/,
          '',
        )}`;

        const hasUrlHash = urlHash.length > 1;

        const urlTo = to || '';

        const fullPath = `${urlTo}?${hasUrlQuery ? stringifyQuery(urlQuery) : ''
          }${hasUrlHash ? urlHash : ''}`;

        if (type === 'path') {
          return fullPath;
        }

        /** Navigate to the url */
        navigate({
          to: fullPath,
          replace: type === 'replace',
        });

        return;
      },
      [existingHash, existingSearch, navigate],
    );

    return fn;
  },
  back: () => {
    const router = useRouter();

    const fn = useCallback(() => {
      router.history.back();
    }, [router]);

    return fn;
  },
  parse: () => {
    const { params } = useMatch({ strict: false });
    const { pathname, search } = useLocation();
    const { resources } = useContext(ResourceContext);

    const { resource, action, matchedRoute } = useMemo(() => {
      return matchResourceFromRoute(pathname, resources);
    }, [resources, pathname]);

    const fn = useCallback(() => {
      const combinedParams: Record<string, any> = {
        ...params,
        ...search,
      };

      const response: ParseResponse = {
        ...(resource && { resource }),
        ...(action && { action }),
        ...((params as any)?.id && {
          id: decodeURIComponent((params as any).id),
        }),
        // ...(params?.action && { action: params.action }), // lets see if there is a need for this
        pathname,
        params: {
          ...combinedParams,
          current: convertToNumberIfPossible(
            combinedParams.current as string,
          ) as number | undefined,
          pageSize: convertToNumberIfPossible(
            combinedParams.pageSize as string,
          ) as number | undefined,
          to: combinedParams.to
            ? decodeURIComponent(combinedParams.to as string)
            : undefined,
        },
      };

      return response;
    }, [pathname, search, params, resource, action]);

    return fn;
  },
  Link: function RefineLink(
    props: ComponentProps<NonNullable<RouterBindings['Link']>>,
  ) {
    return <Link {...props} />;
  },
};

interface ParseInput {
  resources: IResourceItem[];
  pathname: string;
  params: Record<string, string>;
  search: Record<string, string>;
}

export function parse({ resources, params, pathname, search }: ParseInput) {
  const { resource, action, matchedRoute } = matchResourceFromRoute(
    pathname,
    resources,
  );
  const combinedParams: Record<string, any> = {
    ...params,
    ...search,
  };

  const response: ParseResponse = {
    ...(resource && { resource }),
    ...(action && { action }),
    ...(params?.id && {
      id: decodeURIComponent(params.id),
    }),
    // ...(params?.action && { action: params.action }), // lets see if there is a need for this
    pathname,
    params: {
      ...combinedParams,
      current: convertToNumberIfPossible(combinedParams.current as string) as
        | number
        | undefined,
      pageSize: convertToNumberIfPossible(combinedParams.pageSize as string) as
        | number
        | undefined,
      to: combinedParams.to
        ? decodeURIComponent(combinedParams.to as string)
        : undefined,
    },
  };

  return response;
}

export const convertToNumberIfPossible = (value: string | undefined) => {
  if (typeof value === 'undefined') {
    return value;
  }
  const num = Number(value);
  if (`${num}` === value) {
    return num;
  }
  return value;
};