/* ── Primitives ── */
export { Button } from './button/Button'
export type { ButtonProps, ButtonVariant, ButtonSize } from './button/Button'
export { Kbd } from './kbd/Kbd'
export type { KbdProps } from './kbd/Kbd'
export { useKeys, useIsMac, formatKeys } from './kbd/keys'
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

/* ── Records: opening, editing and confirming ── */
export { Sheet } from './overlay/Sheet'
export type { SheetProps } from './overlay/Sheet'
export { Dialog } from './overlay/Dialog'
export type { DialogProps } from './overlay/Dialog'
export { Toaster, toast } from './toast/Toast'
export { CommandMenu, CommandGroup, CommandItem } from './command/Command'
export { Metrics, Metric } from './metric/Metric'
export type { MetricsProps, MetricProps } from './metric/Metric'
export { AreaChart, Bars, ShareBar, ChartPanel, CHART_COLORS } from './chart/Chart'
export type { AreaChartProps, BarsProps, ShareBarProps, SharePart, ChartPanelProps } from './chart/Chart'
export { Ticker } from './motion/Ticker'
export type { TickerProps } from './motion/Ticker'
export type { CommandMenuProps, CommandGroupProps, CommandItemProps } from './command/Command'
export { Field, Textarea, DateInput } from './form/Field'
export type { FieldProps, TextareaProps, DateInputProps } from './form/Field'
export { RadioGroup, MultiSelect } from './form/Choice'
export type { RadioOption, RadioGroupProps, MultiSelectOption, MultiSelectProps } from './form/Choice'
export { RecordHeader, Stepper, PropertyList, Property, PropertySeparator, RecordLayout } from './record/Record'
export type { RecordHeaderProps, StepperProps } from './record/Record'

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
