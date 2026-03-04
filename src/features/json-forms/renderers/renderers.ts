import VerticalLayoutRenderer, { verticalLayoutTester } from './vertical-layout-renderer';
import HorizontalLayoutRenderer, { horizontalLayoutTester } from './horizontal-layout-renderer';
import GroupRenderer, { groupTester } from './group-renderer';
import LabelRenderer, { labelTester } from './label-renderer';
import StringControlRenderer, { stringControlTester } from './string-control-renderer';
import EnumControlRenderer, { enumControlTester } from './enum-control-renderer';
import OrganizerArrayRenderer, { organizerArrayTester } from './organizer-array-renderer';
import KeynoteArrayRenderer, { keynoteArrayTester } from './keynote-array-renderer';
import PlenarySessionArrayRenderer, { plenarySessionArrayTester } from './plenary-session-array-renderer';

export const customRenderers = [
  { tester: verticalLayoutTester, renderer: VerticalLayoutRenderer },
  { tester: horizontalLayoutTester, renderer: HorizontalLayoutRenderer },
  { tester: groupTester, renderer: GroupRenderer },
  { tester: labelTester, renderer: LabelRenderer },
  { tester: stringControlTester, renderer: StringControlRenderer },
  { tester: enumControlTester, renderer: EnumControlRenderer },
  { tester: organizerArrayTester, renderer: OrganizerArrayRenderer },
  { tester: keynoteArrayTester, renderer: KeynoteArrayRenderer },
  { tester: plenarySessionArrayTester, renderer: PlenarySessionArrayRenderer },
];
