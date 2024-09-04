import { Form, ActionPanel, Action, showToast, Clipboard } from "@raycast/api";
import { useState, useEffect } from "react";
import { fetchLatestBlueRate, BlueRate } from "./fetchLatestRate";

export default function Command() {
  const [latestRate, setLatestRate] = useState<BlueRate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const latest = await fetchLatestBlueRate();
        setLatestRate(latest);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  function handleSubmit() {
    if (latestRate) {
      showToast({ 
        title: "Latest Dolar Blue Rate", 
        message: `${latestRate.value_sell} ARS as of ${new Date(latestRate.date).toLocaleString()}` 
      });
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
          {latestRate && (
            <Action.CopyToClipboard
              title="Copy Rate to Clipboard"
              content={latestRate.value_sell.toString()}
              shortcut={{ modifiers: ["cmd"], key: "c" }}
            />
          )}
        </ActionPanel>
      }
    >
      <Form.Description text={error || "Latest Dolar Blue Rate information, updated every 15 minutes."} />
      {latestRate && (
        <>
          <Form.Description
            title="Rate"
            text={`${latestRate.value_sell} ARS`}
          />
          <Form.Description
            title="Date"
            text={new Date(latestRate.date).toLocaleString()}
          />
        </>
      )}
    </Form>
  );
}