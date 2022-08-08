import { POPULAR_LANGUAGES } from "@/lib/languages";
import {
  Select,
  Stack,
  TextInput,
  Text,
  createStyles,
  Button,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useState } from "react";

const useStyles = createStyles({
  fieldset: {
    border: "none",
    padding: 0,
  },
});

export type SearchOptions = {
  query: string;
  fullName: string;
  location: string;
  followers: string;
  repos: string;
  lang: string;
};

export default function AdvancedSearch({
  initial,
  onApply,
}: {
  initial?: Partial<SearchOptions>;
  onApply: (search: SearchOptions) => void;
}) {
  const { classes } = useStyles();
  const [query, setQuery] = useInputState(initial?.query ?? "");
  const [fullName, setFullName] = useInputState(initial?.fullName ?? "");
  const [location, setLocation] = useInputState(initial?.location ?? "");
  const [followers, setFollowers] = useInputState(initial?.followers ?? "");
  const [repos, setRepos] = useInputState(initial?.repos ?? "");
  const [lang, setLang] = useInputState(initial?.lang ?? "");

  // update on back/forward navigation
  const [prevInitial, setInitial] = useState(initial);
  if (prevInitial !== initial) {
    setInitial(initial);

    setQuery(initial?.query ?? "");
    setFullName(initial?.fullName ?? "");
    setLocation(initial?.location ?? "");
    setFollowers(initial?.followers ?? "");
    setRepos(initial?.repos ?? "");
    setLang(initial?.lang ?? "");
  }

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        onApply({
          query,
          fullName,
          location,
          followers,
          repos,
          lang: lang ?? "",
        });
      }}
    >
      <TextInput
        label="Query"
        value={query}
        onChange={setQuery}
        tabIndex={0}
        mb="xl"
      />

      <fieldset className={classes.fieldset}>
        <Text
          component="legend"
          variant="text"
          transform="uppercase"
          color="dark"
          weight="bold"
        >
          Advanced search
        </Text>

        <Stack>
          <TextInput
            label="With this full name"
            value={fullName}
            onChange={setFullName}
            placeholder="Grace Hopper"
          />
          <TextInput
            label="From this location"
            value={location}
            onChange={setLocation}
            placeholder="San Francisco, CA"
          />
          <TextInput
            label="With this many followers"
            value={followers}
            onChange={setFollowers}
            placeholder="20..50,>200,<2"
          />
          <TextInput
            label="With this many public repositories"
            value={repos}
            onChange={setRepos}
            placeholder="0,<42,>4"
          />
          <Select
            label="Working in this language"
            data={POPULAR_LANGUAGES.map((lang) => ({
              ...lang,
              group: "Popular",
            }))}
            searchable
            clearable
            nothingFound="No options"
            value={lang}
            onChange={setLang}
          />
        </Stack>
      </fieldset>

      <Button type="submit" mt="lg">
        Search
      </Button>
    </form>
  );
}
