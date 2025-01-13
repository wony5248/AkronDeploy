import { IWidgetCommonProperties, Nullable, isDefined } from '@akron/runner';
import { action } from 'mobx';
import WidgetModel from 'models/node/WidgetModel';
import { PageSection } from 'models/widget/WidgetPropTypes';

/**
 * 구역 셀렉션 관련 클래스 입니다. 선택된 구역정보와, 구역 데이터가 속해있는 appWidgetModel을 멤버로 들고 있습니다.
 */
export default class SectionSelection {
  private sectionPages: Nullable<WidgetModel[]>;

  private sectionInfo: PageSection;

  private appWidgetModel: WidgetModel<IWidgetCommonProperties>;

  /**
   * SectionSelection 생성자 입니다. 생성 시, 모든 정보를 입력 받습니다.
   */
  public constructor(appWidgetModel: WidgetModel, pageSection: PageSection, sectionPage: Nullable<WidgetModel[]>) {
    this.sectionPages = sectionPage;
    this.sectionInfo = pageSection;
    this.appWidgetModel = appWidgetModel;
  }

  /**
   * 구역에 속한 페이지 리스트를 반환합니다.
   */
  public getSectionPages(): Nullable<WidgetModel[]> {
    return this.sectionPages;
  }

  /**
   * 선택된 구역 정보를 반환합니다.
   */
  public getSectionInfo(): PageSection {
    return this.sectionInfo;
  }

  /**
   * AppWidgetModel을 반환합니다.
   */
  public getAppWidgetModel(): WidgetModel {
    return this.appWidgetModel;
  }

  /**
   * 구역 선택 관련 prop을 변경합니다. appWidgetModel을 갱신합니다.
   */
  @action.bound
  public setSelected(selected: boolean) {
    const appProp = this.appWidgetModel.getProperties();
    const newSectionList: PageSection[] = [];
    if (isDefined(appProp.content.sectionList?.value)) {
      appProp.content.sectionList?.value.forEach((section: PageSection) => {
        if (section.id === this.sectionInfo.id) {
          newSectionList.push({
            ...section,
            isSelected: selected,
          });
        } else {
          newSectionList.push({
            ...section,
          });
        }
      });
      const newAppProp = {
        ...appProp,
        content: {
          ...appProp.content,
          sectionList: { ...appProp.content.secTionList, value: newSectionList },
        },
      };
      this.appWidgetModel.setProperties({
        ...newAppProp,
      });
    }
  }
}
