import { lazy } from "react";
// const DashboardDialog = lazy(() => import("../../pages/admin/requirement/DialogFloodRelief"));
// const RegisterMailOTP = lazy(() => import("./register/RegisterMailOTP"));
// const FilePreviewDialog = lazy(() => import("./register/FilePreviewDialog"));
// const NGOApproveRejectForm = lazy(() => import("./register/NGOApproveRejectForm"))
// const ActivityLocationPick = lazy(() => import("./register/LocationPicker"))
// const AddGlobalMediaStore = lazy(() => import("./activity/AddGlobalMediaStore"))
// const DeleteMediaDocument = lazy(() => import("./activity/DeleteMediaDocument"))
// const BeneficiaryForm  = lazy(() => import("./activity/BeneficiaryForm"));
// const ChangePasswordDialog = lazy(() => import("./register/ChangePasswordDialog"));


// const MOUCreateForm = lazy(() => import("./ngo/MOUCreateForm"));

// const AddFloodGalleryMedia = lazy(() => import("./flood-relief/GalleryMediaStore"));
const dialogComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
    // Register 
    // RegisterMailOTP: RegisterMailOTP,
    // FilePreviewDialog: FilePreviewDialog,
    // NGOApproveRejectForm: NGOApproveRejectForm,
    // ActivityLocationPick: ActivityLocationPick,
    // AddGlobalMediaStore: AddGlobalMediaStore,
    // DeleteMediaDocument: DeleteMediaDocument,
    // viewDocumentDescription: ViewDocumentDescription,
    // BeneficiaryForm: BeneficiaryForm,
    // ChangePasswordDialog: ChangePasswordDialog,
    // MOUCreateForm: MOUCreateForm,
    // GlobalMediaStore: GlobalMediaStore,
    // GalleryMediaStore: AddFloodGalleryMedia,
    // DistrictContactsSelector: DistrictContactsSelector,
    // DashboardDialog: DashboardDialog
    
};

export default dialogComponents;
