import { withJsonFormsControlProps } from '@jsonforms/react';
import { isControl, rankWith, scopeEndsWith } from '@jsonforms/core';
import type { ControlProps } from '@jsonforms/core';
import { UserCircle } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';

interface Organizer {
  name: string;
  institute: string;
}

const OrganizerArrayRenderer = ({
  data,
  handleChange,
  path,
}: ControlProps) => {
  const organizers: Organizer[] = data ?? [{ name: '', institute: '' }];

  const update = (index: number, field: keyof Organizer, value: string) => {
    const updated = organizers.map((org, i) =>
      i === index ? { ...org, [field]: value } : org
    );
    handleChange(path, updated);
  };

  const add = () => handleChange(path, [...organizers, { name: '', institute: '' }]);

  return (
    <div className="border border-slate-200 rounded-[10px] p-5 flex flex-col gap-5">
      <div className="flex items-center gap-2 text-slate-700 font-semibold text-[14px]">
        <UserCircle className="w-4 h-4 text-slate-400" />
        Organizer Details
      </div>

      {organizers.map((org, index) => (
        <div key={index} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 items-start">
            <Label className="text-[13px] font-semibold text-[#111827]">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={org.name}
              onChange={(e) => update(index, 'name', e.target.value)}
              placeholder="Enter name"
              className="h-11 text-sm bg-[#f9fafb] border-gray-200 hover:border-gray-300"
            />
          </div>
          <div className="flex flex-col gap-2 items-start">
            <Label className="text-[13px] font-semibold text-[#111827]">
              Institute <span className="text-red-500">*</span>
            </Label>
            <Input
              value={org.institute}
              onChange={(e) => update(index, 'institute', e.target.value)}
              placeholder="Enter institute"
              className="h-11 text-sm bg-[#f9fafb] border-gray-200 hover:border-gray-300"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="ghost"
        className="w-fit text-primary text-[13px] font-medium px-0 hover:bg-transparent hover:text-primary/80"
        onClick={add}
      >
        + Add Organiser
      </Button>
    </div>
  );
};

export const organizerArrayTester = rankWith(
  5,
  (uischema, schema) => isControl(uischema) && schema?.type === 'array' && scopeEndsWith('organizers')(uischema, schema, undefined)
);
export default withJsonFormsControlProps(OrganizerArrayRenderer);
