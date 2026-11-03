import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/units/$unitId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { unitId } = Route.useParams();

  return (
    <div>unitId: {unitId}</div>
  );
}
