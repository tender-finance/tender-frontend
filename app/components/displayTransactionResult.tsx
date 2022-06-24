import toast from "react-hot-toast";

export function displayTransactionResult(hash: string, message: string) {
  toast.dismiss();
  toast.success(() => (
    <p>
      <a
        href={`https://andromeda-explorer.metis.io/tx/${hash}/internal-transactions/`}
      >
        {message}
      </a>
    </p>
  ));
}
