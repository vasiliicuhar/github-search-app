import { Button, Group, Loader, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useId } from "react";

export default function SearchForm({
  isPending,
  onChange,
}: {
  isPending?: boolean;
  onChange: (query: string) => void;
}) {
  const [input, setInput] = useInputState("");
  const btnId = useId();

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        onChange(input);
      }}
    >
      <Group>
        <TextInput
          value={input}
          onChange={setInput}
          tabIndex={0}
          sx={{ flexGrow: 1 }}
          aria-labelledby={btnId}
        />
        <Button type="submit" id={btnId}>
          {isPending ? (
            <Loader
              size="xs"
              variant="dots"
              color="white"
              mr="xs"
              aria-live="polite"
              aria-label="Searching"
            />
          ) : null}
          Search
        </Button>
      </Group>
    </form>
  );
}
