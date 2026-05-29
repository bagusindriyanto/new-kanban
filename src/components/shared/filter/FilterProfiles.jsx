import { useFetchProfiles } from '@/api/fetchProfiles';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useFilterStore from '@/stores/filterStore';

const FilterProfiles = () => {
  const { data: profiles } = useFetchProfiles();

  const selectedUserId = useFilterStore((state) => state.selectedUserId);
  const setSelectedUserId = useFilterStore((state) => state.setSelectedUserId);

  const items = [
    { label: 'Semua PIC', value: 'all' },
    ...(profiles?.map((profile) => ({
      label: profile.name,
      value: profile.user_id,
    })) || []),
  ];

  return (
    <Select
      items={items}
      value={selectedUserId}
      onValueChange={(val) => setSelectedUserId(val)}
    >
      <SelectTrigger className="w-[150px]" size="sm">
        <SelectValue placeholder="Pilih PIC" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          <SelectLabel>PIC</SelectLabel>
          {items.map((item) => (
            <SelectItem value={item.value} key={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FilterProfiles;
