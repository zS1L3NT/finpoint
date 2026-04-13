@extends("base")
@section("title", "Statement List")
@section("main")

    <h1 class="mb-4">Statements</h1>

    @foreach (\App\Models\Account::all() as $account)
        <h3>{{ $account->name }} ({{ $account->id }})</h3>

        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Supplementary</th>
                    <th>Client</th>
                    <th>Event</th>
                </tr>
            </thead>

            <tbody>
                @foreach ($account->statements->reverse() as $statement)
                    <tr>
                        <td>{{ \Illuminate\Support\Carbon::createFromFormat("Y-m-d", $statement->transaction_date)->format("d M Y") }}</td>
                        <td style="color: {{ $statement->amount < 0 ? "red" : "green" }}">{{ Number::currency($statement->amount) }}</td>
                        <td>{{ $statement->supplementary_code }}</td>
                        <td>{{ $statement->client_reference }}</td>
                        <td>
                            @if ($statement->event)
                            <button class="btn btn-primary">View</button>
                            @else
                            <button class="btn btn-success">Create</button>
                            <button class="btn btn-warning">Link</button>
                            @endif
                        </td> 
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endforeach

@endsection