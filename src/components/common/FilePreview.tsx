import React from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface FilePreviewDrawerProps {
	open: boolean;
	onClose: () => void;
	fileUrl?: string;
	title?: string;
}

const FilePreviewDrawer: React.FC<FilePreviewDrawerProps> = ({ open, onClose, fileUrl, title, }) => {
	let content: React.ReactNode;

	if (!fileUrl) {
		content = <Typography sx={{ p: 2 }}>No file selected</Typography>;
	} else if (fileUrl.endsWith(".pdf")) {
		content = (
			<iframe
				src={fileUrl}
				title={title || "File Preview"}
				style={{ border: "none", flex: 1, width: "100%", height: "100%" }}
			/>
		);
	} else {
		content = <img src={fileUrl} alt="Preview" style={{ width: "100%", height: "auto" }} />;
	}

	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
			sx={{
				"& .MuiDrawer-paper": {
					width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
					padding: 0,
					height: "100%",
					display: "flex",
					flexDirection: "column",
					zIndex: 999,
				},
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					bgcolor: "primary.main",
					color: "white",
					p: 1,
					flexShrink: 0,
				}}
			>
				<Typography variant="h6">{title || "File Preview"}</Typography>
				<IconButton onClick={onClose} sx={{ color: "white" }}>
					<Close />
				</IconButton>
			</Box>
			<Box sx={{ flex: 1, display: "flex", overflow: "auto" }}>
				{content}
			</Box>
		</Drawer>
	);
};

export default FilePreviewDrawer;
