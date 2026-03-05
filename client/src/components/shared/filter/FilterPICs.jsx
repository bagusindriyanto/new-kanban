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

  return (
    <Select value={selectedPicId} onValueChange={setSelectedPicId}>
      <SelectTrigger className="w-[150px]" size="sm">
        <SelectValue placeholder="Pilih PIC" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>PIC</SelectLabel>
          <SelectItem value="all">Semua PIC</SelectItem>
          {pics?.map((pic) => (
            <SelectItem value={pic.id} key={pic.id}>
              {pic.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FilterPics;
