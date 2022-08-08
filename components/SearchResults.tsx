import { fetcher } from "@/lib/fetch";
import { type SearchResponse } from "@/lib/types/search";
import { createStyles, Divider, Group, Text } from "@mantine/core";
import useSWRInfinite from "swr/infinite";
import SearchItem from "./SearchItem";
import { useTransition, type ReactNode } from "react";

const useStyles = createStyles({
  list: {
    listStyle: "none",
    padding: 0,
  },
});

export default function SearchResults({
  query,
  pageSize = 10,
  pagination,
}: {
  query: string;
  pageSize?: number;
  pagination: (
    info: SearchResponse["pageInfo"],
    loadMore: () => void,
    isLoading: boolean
  ) => ReactNode;
}) {
  const { classes } = useStyles();
  const [, startTransition] = useTransition();

  const { data, setSize, isValidating } = useSWRInfinite(
    (index, previousPageData: SearchResponse) => {
      if (previousPageData?.pageInfo.hasNextPage === false) {
        return null;
      }

      if (index === 0) {
        return `/api/search?q=${encodeURIComponent(query)}&limit=${pageSize}`;
      }

      return `/api/search?q=${encodeURIComponent(
        query
      )}&limit=${pageSize}&start=${encodeURIComponent(
        previousPageData.pageInfo.endCursor
      )}`;
    },
    fetcher<SearchResponse>,
    {
      suspense: true,
      revalidateOnFocus: false,
      refreshInterval: 0,
    }
  );

  const handleLoadMore = () => {
    startTransition(() => {
      setSize((sz) => sz + 1);
    });
  };

  const totalCount = data?.[data.length - 1]?.totalCount;

  return data?.length ? (
    <>
      <Group align="center" sx={{ height: "56px" }}>
        <Text role="status" size="sm">
          {totalCount === 1 ? `${totalCount} user` : `${totalCount} users`}
        </Text>
      </Group>
      <Divider />
      <ul className={classes.list}>
        {data
          .map((x) => x.results)
          .flat()
          .map((it) => (
            <li key={it.url}>
              <SearchItem data={it} />
            </li>
          ))}
      </ul>
      {pagination?.(
        data[data.length - 1].pageInfo,
        handleLoadMore,
        isValidating
      )}
    </>
  ) : null;
}
