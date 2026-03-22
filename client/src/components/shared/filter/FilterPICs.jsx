import { useFetchPICs } from '@/api/fetchPICs';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useFilter from '@/stores/filterStore';

const FilterPics = () => {
  const { data: pics } = useFetchPICs();

  const selectedPicId = useFilter((state) => state.selectedPicId);
  const setSelectedPicId = useFilter((state) => state.setSelectedPicId);

  const items = [
    { label: 'Semua PIC', value: 'all' },
    ...(pics?.map((pic) => ({
      label: pic.name,
      value: pic.id,
    })) || []),
  ];

  return (
    <Select
      items={items}
      value={selectedPicId}
      onValueChange={(val) => setSelectedPicId(val)}
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

export default FilterPics;
