@extends("base")
@section("title", "Statement List")
@section("main")

    <h1 class="mb-4">Statements</h1>

    <table class="table">
        <thead>
            <tr>
                <th>Account</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Supplementary</th>
                <th>Client</th>
                <th>Record</th>
            </tr>
        </thead>

        <tbody>
            @foreach ($statements as $statement)
                <tr>
                    <td>
                        {{ $statement->account->name }} ({{ $statement->account->id }})
                    </td>
                    <td>
                        {{ \Illuminate\Support\Carbon::createFromFormat("Y-m-d", $statement->transaction_date)->format("d M Y") }}
                    </td>
                    <td style="color: {{ $statement->amount < 0 ? "red" : "green" }}">
                        {{ Number::currency($statement->amount) }}
                    </td>
                    <td>
                        {{ $statement->supplementary_code }}
                    </td>
                    <td>
                        {{ $statement->client_reference }}
                    </td>
                    <td>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{ $statements->links() }}

@endsection