import * as React from "react";
import { useIndexedDB } from "react-indexed-db";

interface Props {}

const Cart: React.FC<Props> = () => {
  const { getAll, deleteRecord, clear } = useIndexedDB("cart");
  const [cartBooks, updateCartBooks] = React.useState<Array<any>>([]);

  React.useEffect(() => {
    getAll().then((books) => {
      updateCartBooks(books);
    });
  }, [getAll]);

  if (cartBooks.length < 1) return <div />;

  return (
    <aside className="py-5 bottom-0 right-0 w-full md:w-64 fixed h-48 md:h-full bg-white border md:border-0 md:border-l-2 shadow-md">
      <div className="flex h-full flex-col">
        <div className="text-gray-500 text-left pb-8 px-5 hidden lg:block">Cart</div>
        <div className="overflow-y-scroll flex-1">
          {cartBooks.map((b) => (
            <div key={b.id} className="border-b border-gray-200 px-5 py-3">
              <div className="truncate">{b.title}</div>
              <div className="flex justify-between">
                <button
                  className="cursor-pointer text-xs text-red-400"
                  onClick={() => {
                    deleteRecord(b.id);
                  }}
                >
                  Remove
                </button>
                <span>₹{b.price}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5">
          <button
            className="p-2 bg-primary block w-full text-white rounded-sm"
            onClick={() => {
              clear();
            }}
          >
            Checkout / Clear
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Cart;
