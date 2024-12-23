// import { downloadSuperUXGuide } from 'common/component/landing-page/LandingPageBannerComponent';
// import { LandingPageContextMenuProp } from 'common/store/context-menu/ContextMenuTypes';
// import LandingPageStore from 'ux/store/LandingPageStore';

// export const NewProjectContextMenuData: LandingPageContextMenuProp[] = [
//     {
//         id: 'CREATE_UX_PROJECT',
//         variant: 'LandingPageSmallDialogMenuItem',
//         mainText: 'SuperUX',
//         disabled: false,
//         dialogName: 'CreateNewProject',
//     },
//     {
//         id: 'CREATE_GX_PROJECT',
//         variant: 'LandingPageSmallDialogMenuItem',
//         mainText: 'SuperGX',
//         disabled: false,
//         dialogName: 'CreateNewProject',
//     },
// ];

// export const DeleteAppContextMenuData: LandingPageContextMenuProp[] = [
//     {
//         id: 'DELETE_PROJECT',
//         variant: 'LandingPageSmallDialogMenuItem',
//         mainText: '앱 삭제',
//         disabled: false,
//         dialogName: 'DeleteApp',
//     },
// ];

// export const FABContextMenuData: LandingPageContextMenuProp[] = [
//     {
//         id: 'DOWNLOAD_GUIDE',
//         variant: 'LandingPageSmallMenuItem',
//         mainText: '사용 가이드',
//         onClick: () => downloadSuperUXGuide(),
//         disabled: false,
//     },
//     {
//         id: 'HANDLE_BANNER_VISIBILITY',
//         variant: 'LandingPageContextMenuSmallIconItemComponent',
//         mainText: '상단 배너 숨김',
//         imageID: 'IC_CONTEXT_CHECK_DEFAULT',
//         onClick: (...args) => {
//             const landingPageStore = args[1] as LandingPageStore;
//             landingPageStore.setBannerVisibility(!landingPageStore.getBannerVisibility());
//         },
//         disabled: false,
//     },
// ];
