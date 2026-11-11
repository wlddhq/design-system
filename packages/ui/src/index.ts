/* ── Primitives ── */
export { Button } from './button/Button'
export type { ButtonProps, ButtonVariant, ButtonSize } from './button/Button'
export { Kbd } from './kbd/Kbd'
export { Avatar, AvatarGroup } from './avatar/Avatar'
export type { Person, AvatarProps, AvatarGroupProps } from './avatar/Avatar'
export { Logo } from './logo/Logo'
export type { LogoProps } from './logo/Logo'
export { Chip, Tag, TagList } from './chip/Chip'
export type { Tone, ChipProps, TagProps } from './chip/Chip'
export { Dot, DotLabel } from './dot/Dot'
export { ProgressIcon } from './progress/ProgressIcon'
export { Count } from './count/Count'
export { Checkbox } from './checkbox/Checkbox'
export { Switch } from './switch/Switch'
export { Tooltip } from './tooltip/Tooltip'

/* ── Controls ── */
export { Input } from './input/Input'
export { Tabs, Segmented } from './tabs/Tabs'
export type { TabItem } from './tabs/Tabs'
export { Popover, usePopover, MenuItem, MenuLabel, MenuSeparator, PopoverSection, PopoverRow } from './popover/Popover'
export { Select } from './select/Select'
export type { SelectOption } from './select/Select'

/* ── Data display ── */
export { Table, Th, Td, Tr, RecordCell, CellButton, Aggregate } from './table/Table'
export type { ColKind, TableProps, RecordCellProps } from './table/Table'
export { Skeleton } from './skeleton/Skeleton'
export type { SkeletonProps } from './skeleton/Skeleton'
export { SelectionBar } from './selection/SelectionBar'
export { Empty } from './empty/Empty'

export { Track } from './track/Track'
export type { TrackProps } from './track/Track'
export { Sparkline } from './sparkline/Sparkline'
export type { SparklineProps } from './sparkline/Sparkline'

/* ── Views: the five ways to show records (List, Board, Table above, Timeline, Grid) ── */
export { List, ListGroup, ListRow, ListTitle, ListCell } from './list/List'
export type { ListProps, ListGroupProps, ListRowProps, ListCellProps } from './list/List'
export { Board, BoardColumn, BoardCard, useBoardColumn } from './board/Board'
export type { BoardProps, BoardColumnProps, BoardCardProps } from './board/Board'
export { Timeline, TimelineGroup, TimelineRow } from './timeline/Timeline'
export type { TimelineProps, TimelineRowProps } from './timeline/Timeline'
export { CardGrid, CardGroup, RecordCard } from './card/Card'
export type { RecordCardProps } from './card/Card'
export { ViewPicker, ToggleChips } from './display/Display'
export type { ViewOption, ViewPickerProps, ToggleChipsProps } from './display/Display'

/* ── App shell ── */
export { AppShell } from './shell/AppShell'
export {
  Sidebar, SidebarHeader, SidebarBody, SidebarGroup, SidebarItem, SidebarSection, SidebarFooter, IconTile,
  TopBar, TopBarTitle, TopBarActions, Toolbar, Spacer, PageScroll, Page,
} from './shell/Shell'

/* ── Motion & loaders ── */
export { TextMorph } from './motion/TextMorph'
export { Loader, WlddLoader, LOADERS, WLDD_MODES } from './loader/Loader'
export type { LoaderKind, WlddMode, LoaderProps, WlddLoaderProps } from './loader/Loader'
export { WlddLogo } from './loader/WlddLogo'
export type { WlddLogoProps } from './loader/WlddLogo'

export { cx } from './cx'
