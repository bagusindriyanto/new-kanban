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
import { useFetchUsers } from '../api/fetchUsers';

const FilterUsers = () => {
  const { data: users } = useFetchUsers();

  const selectedUserId = useFilterStore((state) => state.selectedUserId);
  const setSelectedUserId = useFilterStore((state) => state.setSelectedUserId);

  const items = [
    { label: 'Semua PIC', value: 'all' },
    ...(users?.map((user) => ({
      label: user.name,
      value: user.id,
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

export default FilterUsers;
