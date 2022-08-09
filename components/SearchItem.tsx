import { GithubSearchResultItem } from "@/lib/types/search";
import { Avatar, Badge, Group, ThemeIcon, Text } from "@mantine/core";
import { IconGitBranch } from "@tabler/icons";
import { useId } from "react";

export default function SearchItem({ data }: { data: GithubSearchResultItem }) {
  const reposLabelId = useId();

  return (
    <Group mb="md" noWrap>
      <Avatar src={data.avatarUrl} alt="" size="sm" />
      <div>
        <Text
          variant="link"
          component="a"
          href={data.url}
          target="_blank"
          rel="noreferrer"
        >
          {data.name || data.login}
        </Text>

        <Group spacing="xs">
          {data.__typename === "User" ? (
            <Badge>Followers: {data.followers.totalCount}</Badge>
          ) : null}

          {data.repositories.totalCount > 0 ? (
            <>
              <ThemeIcon
                aria-label="Repositories"
                size="xs"
                variant="filled"
                color="gray"
                id={reposLabelId}
              >
                <IconGitBranch />
              </ThemeIcon>
              {data.repositories.nodes.map((repo) => (
                <Badge key={repo.url}>
                  <Text
                    variant="link"
                    component="a"
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-describedby={reposLabelId}
                  >
                    {repo.name}
                  </Text>
                </Badge>
              ))}
            </>
          ) : null}
        </Group>
      </div>
    </Group>
  );
}
