export type SavePendingUploads = (T: {
  pendingUploads: string[];
  Parse: Parse;
  projectId: string;
}) => Promise<void>;
